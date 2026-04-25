from pydantic import BaseModel
from typing import Optional


class Skill(BaseModel):
    id: str
    label: str
    label_en: Optional[str] = None


class SkillCreate(BaseModel):
    label: str
    label_en: Optional[str] = None
