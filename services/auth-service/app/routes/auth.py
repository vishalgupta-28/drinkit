from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field
import hashlib
import random

router = APIRouter(prefix="/auth", tags=["auth"])

# In-memory stores for the scaffold. Swap for Postgres + bcrypt + real JWTs.
_OTP_STORE: dict[str, str] = {}
_USERS: dict[str, dict] = {}  # email -> {name, pw_hash}


def _hash(pw: str) -> str:
    # Placeholder hashing. Use passlib/bcrypt in production.
    return hashlib.sha256(pw.encode()).hexdigest()


def _token(email: str) -> str:
    # Placeholder token. Mint a signed JWT (python-jose) in production.
    return f"dev-token-{_hash(email)[:24]}"


# ── Email auth ────────────────────────────────────────────────
class SignupIn(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    password: str = Field(..., min_length=6)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


@router.post("/signup")
async def signup(body: SignupIn):
    email = body.email.lower()
    if email in _USERS:
        raise HTTPException(409, "An account with this email already exists")
    _USERS[email] = {"name": body.name, "pw_hash": _hash(body.password)}
    return {"access_token": _token(email), "token_type": "bearer", "name": body.name}


@router.post("/login")
async def login(body: LoginIn):
    email = body.email.lower()
    user = _USERS.get(email)
    if not user or user["pw_hash"] != _hash(body.password):
        raise HTTPException(401, "Invalid email or password")
    return {"access_token": _token(email), "token_type": "bearer", "name": user["name"]}


# ── Phone OTP (kept for optional mobile login) ────────────────
class PhoneIn(BaseModel):
    phone: str = Field(..., examples=["+919811100000"])


class VerifyIn(BaseModel):
    phone: str
    otp: str


@router.post("/otp/request")
async def request_otp(body: PhoneIn):
    otp = f"{random.randint(0, 999999):06d}"
    _OTP_STORE[body.phone] = otp
    # TODO: send via Twilio. For dev we return it.
    return {"sent": True, "debug_otp": otp}


@router.post("/otp/verify")
async def verify_otp(body: VerifyIn):
    if _OTP_STORE.get(body.phone) != body.otp:
        raise HTTPException(401, "Invalid OTP")
    _OTP_STORE.pop(body.phone, None)
    return {"access_token": f"dev-token-{body.phone}", "token_type": "bearer"}
