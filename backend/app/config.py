from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    supabase_url: str
    supabase_key: str
    editor_password: str = "cristhian2025"
    allowed_origins: list[str] = ["*"]

    class Config:
        env_file = ".env"


settings = Settings()
