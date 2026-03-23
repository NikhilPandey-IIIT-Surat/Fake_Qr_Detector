from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from qr_utils import scan_qr

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.post("/scan")
async def scan(file: UploadFile, expected: str = Form(...)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = scan_qr(file_path)

    if result["status"] != "ok":
        return result

    decoded = result["data"]

    if expected.lower() in decoded.lower():
        return {"status": "real", "decoded": decoded}
    else:
        return {
            "status": "fake",
            "decoded": decoded,
            "reason": "Data mismatch"
        }