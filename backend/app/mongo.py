"""
mongo.py

MongoDB / Motor connection and database client setup.
"""
from pymongo import MongoClient

from app.config import settings

_mongo_client = None


def get_mongo_client() -> MongoClient:
    global _mongo_client
    if _mongo_client is None:
        _mongo_client = MongoClient(settings.mongo_url)
    return _mongo_client


def get_preferences_collection():
    client = get_mongo_client()
    db = client[settings.mongo_db_name]
    return db["guest_preferences"]
