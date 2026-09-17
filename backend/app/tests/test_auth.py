from app.models import Guest, User, UserRole
from app.dependencies.auth import hash_password


def create_users(db_session):
    guest = Guest(name="Jamie Rivera", email="jamie@example.com", loyalty_tier="gold")
    db_session.add(guest)
    db_session.flush()
    db_session.add_all(
        [
            User(username="operations", password_hash=hash_password("meridian2026"), role=UserRole.staff),
            User(username=guest.email, password_hash=hash_password("guest123"), role=UserRole.guest, guest_id=guest.id),
        ]
    )
    db_session.commit()


def test_staff_login_returns_bearer_token(client, db_session):
    create_users(db_session)
    response = client.post("/api/v1/auth/login", json={"username": "operations", "password": "meridian2026"})
    assert response.status_code == 200
    assert response.json()["user"]["role"] == "STAFF"
    assert response.json()["access_token"]


def test_invalid_staff_login_is_rejected(client, db_session):
    create_users(db_session)
    response = client.post("/api/v1/auth/login", json={"username": "operations", "password": "wrong"})
    assert response.status_code == 401


def test_guest_login_accepts_guest_email_and_me_returns_identity(client, db_session):
    create_users(db_session)
    response = client.post("/api/v1/auth/guest/login", json={"username": "jamie@example.com", "password": "guest123"})
    token = response.json()["access_token"]
    me = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert me.status_code == 200
    assert me.json()["guest_id"]


def test_cors_preflight_allows_frontend_origin(client):
    response = client.options(
        "/api/v1/auth/guest/login",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"