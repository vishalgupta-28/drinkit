from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import random

router = APIRouter(prefix="/auth", tags=["auth"])

# In-memory OTP store for scaffold. Swap for Redis + Twilio in production.
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
    # TODO: send via Twilio. For dev we return it.
    return {"sent": True, "debug_otp": otp}


@router.post("/otp/verify")
async def verify_otp(body: VerifyIn):
    if _OTP_STORE.get(body.phone) != body.otp:
        raise HTTPException(401, "Invalid OTP")
    _OTP_STORE.pop(body.phone, None)
    # TODO: mint real JWT (python-jose) with settings.jwt_secret
    return {"access_token": f"dev-token-{body.phone}", "token_type": "bearer"}
