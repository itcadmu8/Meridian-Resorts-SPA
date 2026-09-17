from typing import List


def generate_simple_embedding(text: str) -> List[float]:
    # Simple deterministic hash embedding for similarity retrieval without external API key dependency
    words = text.lower().split()
    vector = [0.0] * 16
    for idx, word in enumerate(words):
        vector[hash(word) % 16] += 1.0
    total = sum(vector) or 1.0
    return [v / total for v in vector]