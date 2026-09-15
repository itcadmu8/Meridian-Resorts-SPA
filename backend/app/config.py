from pathlib import Path

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
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ]

    # AI concierge chatbot (Google Gemini)
    gemini_api_key: str = ""
    gemini_model: str = "gemini-3.6-flash"

    # Set to true only by the test suite (see tests/conftest.py) to skip touching
    # the real Postgres/Mongo services during startup.
    testing: bool = False
    auth_secret: str = "meridian-development-auth-secret-change-me"


settings = Settings()
