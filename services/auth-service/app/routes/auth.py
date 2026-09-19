from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError
import random

from ..db import get_db
from ..security import hash_password, verify_password, create_access_token, decode_token

router = APIRouter(prefix="/auth", tags=["auth"])
bearer = HTTPBearer(auto_error=True)


# ── Schemas ───────────────────────────────────────────────────
class SignupIn(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    password: str = Field(..., min_length=6)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    name: str


# ── Email auth (bcrypt + Postgres + signed JWT) ───────────────
@router.post("/signup", response_model=TokenOut)
async def signup(body: SignupIn, db: AsyncSession = Depends(get_db)):
    email = body.email.lower()
    exists = (await db.execute(text("SELECT 1 FROM users WHERE lower(email) = :e"), {"e": email})).first()
    if exists:
        raise HTTPException(409, "An account with this email already exists")

    row = (
        await db.execute(
            text(
                "INSERT INTO users (email, name, password_hash) "
                "VALUES (:e, :n, :p) RETURNING id"
            ),
            {"e": email, "n": body.name, "p": hash_password(body.password)},
        )
    ).first()
    await db.commit()

    token = create_access_token(str(row[0]), {"email": email, "name": body.name})
    return TokenOut(access_token=token, name=body.name)


@router.post("/login", response_model=TokenOut)
async def login(body: LoginIn, db: AsyncSession = Depends(get_db)):
    email = body.email.lower()
    row = (
        await db.execute(
            text("SELECT id, name, password_hash FROM users WHERE lower(email) = :e"),
            {"e": email},
        )
    ).first()
    if not row or not verify_password(body.password, row[2]):
        raise HTTPException(401, "Invalid email or password")

    token = create_access_token(str(row[0]), {"email": email, "name": row[1]})
    return TokenOut(access_token=token, name=row[1])


# ── Token verification (reusable dependency for any service) ──
async def current_user(creds: HTTPAuthorizationCredentials = Depends(bearer)) -> dict:
    try:
        return decode_token(creds.credentials)  # verifies signature + expiry
    except JWTError:
        raise HTTPException(401, "Invalid or expired token")


@router.get("/me")
async def me(user: dict = Depends(current_user)):
    """Protected endpoint — proves the JWT is actually verified."""
    return {"id": user.get("sub"), "email": user.get("email"), "name": user.get("name")}


# ── Phone OTP (optional; now issues a real JWT too) ───────────
_OTP_STORE: dict[str, str] = {}


class PhoneIn(BaseModel):
    phone: str = Field(..., examples=["+919811100000"])


class VerifyIn(BaseModel):
    phone: str
    otp: str


@router.post("/otp/request")
async def request_otp(body: PhoneIn):
    otp = f"{random.randint(0, 999999):06d}"
    _OTP_STORE[body.phone] = otp
    return {"sent": True, "debug_otp": otp}  # TODO: send via Twilio


@router.post("/otp/verify", response_model=TokenOut)
async def verify_otp(body: VerifyIn):
    if _OTP_STORE.get(body.phone) != body.otp:
        raise HTTPException(401, "Invalid OTP")
    _OTP_STORE.pop(body.phone, None)
    token = create_access_token(body.phone, {"phone": body.phone})
    return TokenOut(access_token=token, name=body.phone)
