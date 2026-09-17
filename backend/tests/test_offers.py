"""
test_offers.py

Unit/Integration test suite for offers.
"""
def test_get_offers(client):
    response = client.get("/api/v1/offers")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
