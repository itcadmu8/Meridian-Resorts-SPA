def test_ai_chat_endpoint(client):
    payload = {
        "message": "What dining options do you have in the Maldives property?",
        "history": [],
    }
    response = client.post("/api/v1/ai/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data