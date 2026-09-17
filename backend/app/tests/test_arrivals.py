def test_get_arrivals(client):
    response = client.get("/api/v1/arrivals")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)