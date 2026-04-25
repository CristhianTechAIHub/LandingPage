from fastapi import APIRouter, HTTPException
from app.database import supabase
from app.models.skill import Skill, SkillCreate
import re

router = APIRouter()


def _slug(label: str) -> str:
    return re.sub(r"[^a-z0-9-]", "", label.lower().replace(" ", "-"))[:40]


@router.get("/", response_model=list[Skill])
def get_skills():
    result = supabase.table("skills").select("*").execute()
    return result.data


@router.post("/", response_model=Skill, status_code=201)
def create_skill(body: SkillCreate):
    skill_id = _slug(body.label)
    data = body.model_dump()
    data["id"] = skill_id

    result = supabase.table("skills").insert(data).execute()
    return result.data[0]


@router.put("/{skill_id}", response_model=Skill)
def update_skill(skill_id: str, body: SkillCreate):
    result = supabase.table("skills").update(body.model_dump()).eq("id", skill_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Skill not found")
    return result.data[0]


@router.delete("/{skill_id}", status_code=204)
def delete_skill(skill_id: str):
    supabase.table("skills").delete().eq("id", skill_id).execute()
