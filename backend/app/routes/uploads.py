from fastapi import APIRouter, UploadFile, File, HTTPException
from app.database import supabase
import uuid
import os

router = APIRouter()

BUCKET = "portfolio-images"
ALLOWED = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_SIZE = 5 * 1024 * 1024  # 5 MB


@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED:
        raise HTTPException(status_code=400, detail="Formato no permitido. Usa JPG, PNG o WebP.")

    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="El archivo supera el límite de 5 MB.")

    ext = os.path.splitext(file.filename or "img.jpg")[1]
    filename = f"{uuid.uuid4().hex}{ext}"

    supabase.storage.from_(BUCKET).upload(filename, content, {"content-type": file.content_type})

    public_url = supabase.storage.from_(BUCKET).get_public_url(filename)
    return {"url": public_url}
