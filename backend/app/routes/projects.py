from fastapi import APIRouter, HTTPException
from app.database import supabase
from app.models.project import Project, ProjectCreate
import re

router = APIRouter()


def _slug(name: str) -> str:
    return re.sub(r"[^a-z0-9-]", "", name.lower().replace(" ", "-"))[:40]


@router.get("/", response_model=list[Project])
def get_projects():
    result = supabase.table("projects").select("*").order("num").execute()
    return result.data


@router.post("/", response_model=Project, status_code=201)
def create_project(body: ProjectCreate):
    project_id = _slug(body.name)
    count_result = supabase.table("projects").select("id", count="exact").execute()
    num = f"proyecto_{str((count_result.count or 0) + 1).zfill(2)}"

    data = body.model_dump()
    data["id"] = project_id
    data["num"] = num
    # Serializar listas anidadas para Supabase (JSON)
    data["features"] = [f.model_dump() for f in body.features]

    result = supabase.table("projects").insert(data).execute()
    return result.data[0]


@router.put("/{project_id}", response_model=Project)
def update_project(project_id: str, body: ProjectCreate):
    data = body.model_dump()
    data["features"] = [f.model_dump() for f in body.features]

    result = supabase.table("projects").update(data).eq("id", project_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Project not found")
    return result.data[0]


@router.delete("/{project_id}", status_code=204)
def delete_project(project_id: str):
    supabase.table("projects").delete().eq("id", project_id).execute()
