"""
test_auth_context.py

Unit/Integration test suite for auth context.
"""
def test_auth_context_validation(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code in (200, 401)
