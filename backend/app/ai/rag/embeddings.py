"""Lightweight embedding utilities for vector similarity lookups."""


def generate_simple_embedding(text: str) -> list[float]:
    """Generate a deterministic normalized bag-of-words vector for local similarity ranking."""
    words = text.lower().split()
    vector = [0.0] * 16
    for word in words:
        vector[hash(word) % 16] += 1.0
    total = sum(vector) or 1.0
    return [v / total for v in vector]
