from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import projects, skills, uploads

app = FastAPI(title="Portfolio API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción: reemplazar con el dominio de Vercel
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(skills.router,   prefix="/api/skills",   tags=["skills"])
app.include_router(uploads.router,  prefix="/api/uploads",  tags=["uploads"])


@app.get("/")
def root():
    return {"status": "ok", "message": "Portfolio API running"}
