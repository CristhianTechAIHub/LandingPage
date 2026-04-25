from pydantic import BaseModel
from typing import Optional


class Feature(BaseModel):
    label: str
    text: str


class Project(BaseModel):
    id: str
    num: str
    name: str
    client: Optional[str] = ""
    featured: bool = False
    skills: list[str] = []
    images: list[str] = []
    excerpt: str
    description: Optional[str] = ""
    features: list[Feature] = []
    tech: list[str] = []
    github: Optional[str] = None
    video: Optional[str] = None


class ProjectCreate(BaseModel):
    name: str
    client: Optional[str] = ""
    featured: bool = False
    skills: list[str] = []
    images: list[str] = []
    excerpt: str
    description: Optional[str] = ""
    features: list[Feature] = []
    tech: list[str] = []
    github: Optional[str] = None
    video: Optional[str] = None
