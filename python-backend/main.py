from fastapi import FastAPI, UploadFile, File
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
    return {"filename": file.filename, "columns": df.columns.tolist()}

if __name__ == "__main__":
    print("Starting server...")
