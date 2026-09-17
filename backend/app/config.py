import json
from pathlib import Path
from typing import Any

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def _resolve_env_file() -> str:
    candidates = [
        Path.cwd() / ".env",
        Path(__file__).resolve().parent.parent.parent / ".env",
        Path(__file__).resolve().parent.parent / ".env",
        Path(__file__).resolve().parent / ".env",
    ]
    for candidate in candidates:
        if candidate.exists():
            return str(candidate)
    return ".env"


class Settings(BaseSettings):
    """
    Central app configuration, loaded from environment variables (see .env.example
    at the repo root). Extend this as your team adds vertical-specific config
    (e.g. third-party API keys for Sprint 3's RAG/agent features).
    """

    model_config = SettingsConfigDict(env_file=_resolve_env_file(), extra="ignore")

    database_url: str = "postgresql+psycopg2://meridian:meridian@localhost:5432/meridian"
    mongo_url: str = "mongodb://localhost:27017"
    mongo_db_name: str = "meridian"

    @property
    def normalized_database_url(self) -> str:
        if self.database_url.startswith('postgresql://'):
            return self.database_url.replace('postgresql://', 'postgresql+psycopg2://', 1)
        return self.database_url

    seed_on_startup: bool = True
    default_property_capacity: int = 20
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Any) -> list[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    # AI concierge chatbot (OpenAI)
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"

    # Set to true only by the test suite (see tests/conftest.py) to skip touching
    # the real Postgres/Mongo services during startup.
    testing: bool = False
    auth_secret: str = "meridian-development-auth-secret-change-me"


settings = Settings()
