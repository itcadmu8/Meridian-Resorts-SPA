"""
retriever.py

AI & RAG module supporting agent workflows, retrieval, or prompt orchestration for retriever.
"""
from pathlib import Path

from app.ai.rag.ingestion import load_knowledge_base


def retrieve_context(
    query: str, property_id: str | None = None, knowledge_dir: Path | None = None
) -> list[dict[str, str]]:
    if knowledge_dir is None:
        knowledge_dir = Path(__file__).resolve().parents[4] / "meridian_knowledge"

    chunks = load_knowledge_base(knowledge_dir)
    query_lower = query.lower()
    matches = []

    for chunk in chunks:
        if property_id and chunk["property_id"] != property_id:
            continue
        # Relevance check
        content_lower = chunk["content"].lower()
        query_words = [w for w in query_lower.split() if len(w) > 2]
        score = sum(1 for w in query_words if w in content_lower)
        if score > 0 or not query_words:
            matches.append((score, chunk))

    matches.sort(key=lambda x: x[0], reverse=True)
    return [m[1] for m in matches[:3]]
