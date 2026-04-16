from dataclasses import dataclass
from langchain.agents import create_agent
from langchain.tools import tool , ToolRuntime
from langchain_groq import ChatGroq
from langchain.messages import SystemMessage
from pydantic import BaseModel , Field
import os
from dotenv import load_dotenv
from typing import List 
from dto.process import ModelMetricContext
from dto.output import FinalModelReview

load_dotenv()

os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY") # type: ignore
os.environ["TAVILY_API_KEY"] = os.getenv("TAVILY_API_KEY") # type: ignore

## Tool making for AI review structuring
@tool("generate_confusion_matrix_review")
def generate_confusion_matrix_review(runtime: ToolRuntime[ModelMetricContext]) -> str:
    """Review the confusion matrix and provide insights on model performance.
    Also make improvement suggestions based on the confusion matrix."""

    context = runtime.context

    # Here you would parse the confusion_matrix_str and generate insights
    confusion_matrix = context.confusion_matrix_str

    # Confusion matrix parsing and analysis logic would go here.
    review = f"Confusion Matrix Review for {context.model_name}:\n"
    review += f"Confusion Matrix:\n{confusion_matrix}\n"

    return review 

@tool("generate_feature_importance_review")
def generate_feature_importance_review(runtime: ToolRuntime[ModelMetricContext]) -> str:
    """Review the feature importance and provide insights on which features are most influential for the model's predictions.
    Also make improvement suggestions based on the feature importance."""

    context = runtime.context

    # Here you would parse the feature_importance_str and generate insights
    feature_importance = context.feature_importance_str

    # Feature importance parsing and analysis logic would go here.
    review = f"Feature Importance Review for {context.model_name}:\n"
    review += f"Feature Importance:\n{feature_importance}\n"

    return review

## Model initialization
model = ChatGroq(model="openai/gpt-oss-120b", temperature=0.7, max_tokens=1000)

### Structuring the model
# model_with_structure = model.with_structured_output(ModelMetricContext)

## Create the agent with the tools
system_prompt_message = """You are an expert data scientist tasked with reviewing the performance of a machine learning model based on its metrics and providing insights and improvement suggestions. Use the provided tools to analyze the confusion matrix, feature importance, and domain benchmarks to generate a comprehensive review of the model's performance. Focus on actionable insights and specific recommendations for improving the model based on the provided metrics and analyses."""

agent = create_agent(
    model=model,
    tools=[generate_confusion_matrix_review, generate_feature_importance_review],
    context_schema=ModelMetricContext,
    system_prompt=system_prompt_message
)

def generate_structured_review(context: ModelMetricContext) -> str:
    """Generate a structured review of the model's performance based on the provided context."""
    
    agent_result = agent.invoke(
        {"messages":[{"role": "user", "content": "Review this model's Performance based on the provided metrics and analyses."}]},
        context=context
    )

    raw_text = agent_result["messages"][-1].content

    ## Formating the agent's review
    formatter = model.with_structured_output(FinalModelReview)
    structured_output = formatter.invoke(f"Extract this review into the required JSON format:\n\n{raw_text}")
    
    # Return as a standard Python dictionary so FastAPI can serialize it
    return structured_output.model_dump_json() #type: ignore