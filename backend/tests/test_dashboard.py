"""
test_dashboard.py

Unit/Integration test suite for dashboard.
"""
def test_get_operations_dashboard(client):
    response = client.get("/api/v1/dashboard/operations")
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "properties" in data
    assert data["summary"]["total_properties"] == len(data["properties"])
