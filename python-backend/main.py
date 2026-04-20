from fastapi import FastAPI, Form, HTTPException, UploadFile, File
import json
import pandas as pd
import io
import numpy as np
from sklearn.metrics import confusion_matrix, accuracy_score , precision_score , f1_score , recall_score , r2_score
import services.data_processing as data_processing_service
import services.data_validation as data_validation
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
        try:
            # This converts the string into a true Python Object with all your defaults
            payload_data = PipelinePayloadDTO.model_validate_json(payload)
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"Invalid JSON Payload: {str(e)}")
        
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        ## Data processing
        X_train, X_test, y_train, y_test = data_processing_service.data_processing_pipeline(df, payload_data.data_processing)
        
        ## Data validation
        try:
            data_validation.validate_model_compatibility(X_train, y_train, payload_data.ml_model.model_name , payload_data.data_processing)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Data Validation Error: {str(e)}")
        
        ## Build the model
        model = ml_processing_service.build_model(payload_data.ml_model , X_train)
        
        ## Training the model
        model_name = payload_data.ml_model.model_name

        try:
            if model_name in ["ann", "cnn"]:
                # Pull dynamically from your DTO
                epochs = 10
                batch_size = 128
                
                model.fit(X_train, y_train, epochs=epochs, batch_size=batch_size) #type: ignore
            else:
                model.fit(X_train, y_train)
        except Exception as e:
            raise HTTPException(status_code=200, detail=f"Model Training Error: {str(e)}")

        ## Evaluating the model
        try:
            # 1. Generate predictions ONCE (Calling predict() 4 times is very slow)
            raw_predictions = model.predict(X_test)

            # 2. Format predictions based on model type
            if model_name in ["ann", "cnn"]:
                # Keras returns probabilities; convert to 1D array
                if payload_data.ml_model.model_type == "classification":
                    # Convert probabilities to 0 or 1
                    y_pred = (raw_predictions > 0.5).astype(int).flatten()
                else:
                    y_pred = raw_predictions.flatten()
            else:
                # Scikit-learn returns standard arrays
                y_pred = raw_predictions

            # 3. Calculate appropriate metrics based on task type
            if model_name in ["linear_regression"] or payload_data.ml_model.model_type == "regression":
                # Regression Metrics
                acc = r2_score(y_test, y_pred) # Reusing 'acc' variable for R2
                prec, f1, rec = 0.0, 0.0, 0.0  # Not applicable for regression
                conf_matrix_str = "N/A"
            else:
                # Classification Metrics
                acc = accuracy_score(y_test, y_pred)
                # added zero_division=0 to prevent warnings if a class is never predicted
                prec = precision_score(y_test, y_pred, average='weighted', zero_division=0)
                f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)    
                rec = recall_score(y_test, y_pred, average='weighted', zero_division=0)

                conf_matrix = confusion_matrix(y_test, y_pred)
                conf_matrix_str = np.array2string(conf_matrix)

            # 4. Construct Context
            context = ModelMetricContext(
                model_name=model_name,
                accuracy=float(acc),   # Fixed: this was hardcoded to 100 in your code
                f1_score=float(f1),
                precision=float(prec),
                recall=float(rec),
                latency_ms=0, 
                confusion_matrix_str=conf_matrix_str,
                feature_importance_str="N/A" 
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Model Evaluation Error: {str(e)}")
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
        
    except HTTPException as http_exc:
        raise http_exc
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {str(e)}")

if __name__ == "__main__":
    print("Starting server...")
