from __future__ import annotations

import logging
from collections.abc import MutableMapping
from typing import Any

from pymongo import MongoClient
from pymongo.errors import PyMongoError

from app.config import settings

logger = logging.getLogger(__name__)


class InMemoryFakePreferencesCollection:
    def __init__(self):
        self._documents: dict[str, dict] = {}

    def find_one(self, query):
        guest_id = query.get("guest_id")
        return self._documents.get(guest_id)

    def update_one(self, query, update, upsert=False):
        guest_id = query.get("guest_id")
        if guest_id is None:
            raise NotImplementedError("Only guest_id queries are supported")
        stored = self._documents.setdefault(guest_id, {})
        stored.update(update.get("$set", {}))
        return None


class ResilientPreferencesCollection:
    """Wraps the real Mongo collection but falls back to an in-memory store
    when Mongo is unreachable, so local/dev runs without Mongo don't crash."""

    def __init__(self, real_collection, fallback: InMemoryFakePreferencesCollection):
        self._real = real_collection
        self._fallback = fallback

    def find_one(self, query):
        try:
            return self._real.find_one(query)
        except PyMongoError:
            logger.warning("Mongo unavailable; using in-memory guest preferences store")
            return self._fallback.find_one(query)

    def update_one(self, query, update, upsert=False):
        try:
            return self._real.update_one(query, update, upsert=upsert)
        except PyMongoError:
            logger.warning("Mongo unavailable; using in-memory guest preferences store")
            return self._fallback.update_one(query, update, upsert=upsert)


_client = None
_in_memory_preferences = InMemoryFakePreferencesCollection()


def get_client() -> MongoClient:
    global _client
    if _client is None:
        _client = MongoClient(settings.mongo_url, serverSelectionTimeoutMS=2000)
    return _client


def get_database():
    return get_client()[settings.mongo_db_name]


def get_preferences_collection():
    if settings.testing:
        return _in_memory_preferences
    return ResilientPreferencesCollection(
        get_database()["guest_preferences"], _in_memory_preferences
    )


__all__ = ["get_client", "get_database", "get_preferences_collection"]
