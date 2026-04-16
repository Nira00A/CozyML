from fastapi import FastAPI, Form, HTTPException, UploadFile, File
import json
import pandas as pd
import io
import numpy as np
from sklearn.metrics import confusion_matrix, accuracy_score , precision_score , f1_score , recall_score 
import services.data_processing as data_processing_service
import services.ml_processing as ml_processing_service
from dto.process import DataProcessingDTO, PipelinePayloadDTO , ModelMetricContext
from services.ai_response import generate_structured_review

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello from python-backend!"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    # Process the DataFrame as needed
    return {"filedata": df.head(5).to_dict(orient="records"), "columns": df.columns.tolist()}

@app.post("/preprocess")
async def data_processing(
    file: UploadFile = File(...),
    payload: str = Form(...)
    ):

    try:
        # This converts the string into a true Python Object with all your defaults
        payload_data = PipelinePayloadDTO.model_validate_json(payload)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Invalid JSON Payload: {str(e)}")
    
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    
    ## Data processing
    X_train, X_test, y_train, y_test = data_processing_service.data_processing_pipeline(df, payload_data.data_processing)
    
    ## Build the model
    model = ml_processing_service.build_model(payload_data.ml_model , X_train)

    ## Training the model
    model_name = payload_data.ml_model.model_name

    if model_name in ["ann", "cnn"]:
        # Pull dynamically from your DTO
        epochs = payload_data.ml_model.epochs #type: ignore
        batch_size = payload_data.ml_model.batch_size #type: ignore

        model.fit(X_train, y_train, epochs=epochs, batch_size=batch_size) #type: ignore
    else:
        model.fit(X_train, y_train)

    ## Evaluating the model
    score = model.score(X_test, y_test)
    acc = accuracy_score(y_test, model.predict(X_test))
    prec = precision_score(y_test, model.predict(X_test), average='weighted')
    f1 = f1_score(y_test, model.predict(X_test), average='weighted')    
    rec = recall_score(y_test, model.predict(X_test), average='weighted')

    conf_matrix = confusion_matrix(y_test, model.predict(X_test))
    conf_matrix_str = np.array2string(conf_matrix)

    context = ModelMetricContext(
        model_name=model_name,
        accuracy=float(acc),
        f1_score=float(f1),
        precision=float(prec),
        recall=float(rec),
        latency_ms=0, # Hard coded value for demonstration
        confusion_matrix_str=conf_matrix_str,
        feature_importance_str="N/A" # Hard coded value for demonstration
    )

    structured_review = generate_structured_review(context)

    return {
        "payload": payload_data.ml_model,
        "metrics": {
            "accuracy": acc,
            "f1_score": f1,
            "latency_ms": 0 # Hard coded value for demonstration
        },
        "structured_review": structured_review
    }

if __name__ == "__main__":
    print("Starting server...")
