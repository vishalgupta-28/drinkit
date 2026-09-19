"""Password hashing (bcrypt) and JWT creation/verification."""
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import jwt

from .config import settings

ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    # bcrypt has a 72-byte limit; truncate defensively so long inputs don't error.
    return pwd_context.hash(password[:72])


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password[:72], hashed)


def create_access_token(subject: str, claims: dict | None = None) -> str:
    """Signed JWT with `sub`, `iat`, `exp`. `subject` is the user id."""
    now = datetime.now(timezone.utc)
    payload: dict = {
        "sub": subject,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(seconds=settings.jwt_expiry)).timestamp()),
    }
    if claims:
        payload.update(claims)
    return jwt.encode(payload, settings.jwt_secret, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    """Verify signature + expiry, returning the claims. Raises JWTError on failure."""
    return jwt.decode(token, settings.jwt_secret, algorithms=[ALGORITHM])
