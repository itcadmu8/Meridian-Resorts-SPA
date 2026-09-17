"""Authentication and token handling dependencies."""

import base64
import hashlib
import hmac
import json
import time

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import User, UserRole

bearer_scheme = HTTPBearer(auto_error=False)


def hash_password(password: str, salt: bytes | None = None) -> str:
    """Hash password using PBKDF2 with SHA-256."""
    salt = salt or hashlib.sha256(settings.auth_secret.encode()).digest()[:16]
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 120_000)
    b64_salt = base64.urlsafe_b64encode(salt).decode()
    b64_digest = base64.urlsafe_b64encode(digest).decode()
    return f"pbkdf2_sha256$120000${b64_salt}${b64_digest}"


def verify_password(password: str, password_hash: str) -> bool:
    """Verify raw password against stored PBKDF2 hash."""
    try:
        algorithm, iterations, encoded_salt, encoded_digest = password_hash.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        salt = base64.urlsafe_b64decode(encoded_salt.encode())
        expected = base64.urlsafe_b64decode(encoded_digest.encode())
        actual = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, int(iterations))
        return hmac.compare_digest(actual, expected)
    except (ValueError, TypeError):
        return False


def _signature(payload: str) -> str:
    """Generate HMAC-SHA256 signature for token payload."""
    digest = hmac.new(settings.auth_secret.encode(), payload.encode(), hashlib.sha256).digest()
    return base64.urlsafe_b64encode(digest).decode().rstrip("=")


def create_access_token(user: User) -> str:
    """Generate signed JWT access token for user."""
    claims = {"sub": user.id, "role": user.role.value, "exp": int(time.time()) + 8 * 60 * 60}
    encoded = (
        base64.urlsafe_b64encode(json.dumps(claims, separators=(",", ":")).encode())
        .decode()
        .rstrip("=")
    )
    return f"{encoded}.{_signature(encoded)}"


def _decode_token(token: str) -> dict:
    """Validate and decode JWT access token claims."""
    try:
        encoded, signature = token.split(".", 1)
        if not hmac.compare_digest(signature, _signature(encoded)):
            raise ValueError
        padding = "=" * (-len(encoded) % 4)
        claims = json.loads(base64.urlsafe_b64decode(f"{encoded}{padding}"))
        if claims.get("exp", 0) < time.time():
            raise ValueError
        return claims
    except (ValueError, TypeError, json.JSONDecodeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token"
        ) from None


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """FastAPI dependency to extract and authenticate current active user."""
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required"
        )
    claims = _decode_token(credentials.credentials)
    user = db.get(User, claims.get("sub"))
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User is inactive or unavailable"
        )
    return user


def require_role(role: UserRole):
    """Dependency factory restricting endpoints to specific user roles."""

    def dependency(user: User = Depends(get_current_user)) -> User:
        if user.role != role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions"
            )
        return user

    return dependency
