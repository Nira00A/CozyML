from fastapi import FastAPI, Form, UploadFile, File
import pandas as pd
import io

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
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    

    return {"preprocessed_data": df.head(5).to_dict(orient="records")
    }

if __name__ == "__main__":
    print("Starting server...")
