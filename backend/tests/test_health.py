"""
test_health.py

Unit/Integration test suite for health.
"""
def test_health_check(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}
