from pydantic import BaseModel, Field
from typing import List

class FinalModelReview(BaseModel):
    score_out_of_10: float = Field(description="Overall performance score from 1 to 10")
    key_strengths: List[str] = Field(description="List of the model's strong points")
    critical_weaknesses: List[str] = Field(description="List of issues or areas falling short of benchmarks")
    actionable_recommendations: List[str] = Field(description="Specific steps to improve the model")
    domain_compliance: str = Field(description="Notes on how it meets or fails domain-specific needs")

