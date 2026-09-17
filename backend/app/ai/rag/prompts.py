"""System prompts and prompt assembly builders for RAG responses."""

SYSTEM_RAG_PROMPT = """You are Meridian Assistant, an AI concierge for Meridian Resorts & Spa.
You provide helpful, grounded information about spa treatments, dining options,
operating hours, and resort amenities.
Always ground your answers in the provided context documents.
Do not invent information outside the provided reference documents.
For transactional spa bookings, check availability and present options,
then wait for explicit guest confirmation before finalizing.
"""


def build_grounded_prompt(user_query: str, context_chunks: list) -> str:
    """Assemble reference context documents and guest query into a grounded prompt."""
    context_text = "\n\n".join(
        [
            f"[{c.get('property_id', 'general')} - {c.get('doc_name', 'info')}]: "
            f"{c.get('content', '')}"
            for c in context_chunks
        ]
    )
    return (
        f"{SYSTEM_RAG_PROMPT}\n\nReference Context:\n{context_text}\n\nUser Question: {user_query}"
    )
