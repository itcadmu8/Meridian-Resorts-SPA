"""
test_inventory.py

Unit/Integration test suite for inventory.
"""
def test_get_inventory(client):
    response = client.get("/api/v1/inventory")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
