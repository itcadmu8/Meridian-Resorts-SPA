from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings

engine_url = settings.database_url
if engine_url.startswith('postgresql://'):
    engine_url = engine_url.replace('postgresql://', 'postgresql+psycopg2://', 1)

engine = create_engine(engine_url, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

__all__ = ["Base", "SessionLocal", "engine", "get_db"]
