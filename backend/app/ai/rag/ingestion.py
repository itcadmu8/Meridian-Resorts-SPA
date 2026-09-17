"""
ingestion.py

AI & RAG module supporting agent workflows, retrieval, or prompt orchestration for ingestion.
"""
from pathlib import Path


def load_knowledge_base(knowledge_dir: Path) -> list[dict[str, str]]:
    chunks: list[dict[str, str]] = []
    if not knowledge_dir.exists():
        return chunks

    for prop_dir in sorted(knowledge_dir.glob("property-*")):
        prop_id = prop_dir.name
        for doc_file in sorted(prop_dir.glob("*.md")):
            content = doc_file.read_text(encoding="utf-8").strip()
            if content:
                chunks.append(
                    {
                        "property_id": prop_id,
                        "doc_name": doc_file.name,
                        "content": content,
                    }
                )
    return chunks
