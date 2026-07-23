from fastapi import APIRouter
from pydantic import BaseModel
import uuid

router = APIRouter(prefix="/payments", tags=["payments"])


class CreateOrderIn(BaseModel):
    amount: float          # in INR
    order_id: str
    currency: str = "INR"


@router.post("/create")
async def create_payment(body: CreateOrderIn):
    """Create a Razorpay-style order. Scaffold returns a mock order id.

    In production: use razorpay client with settings.razorpay_key_id/secret.
    """
    return {
        "razorpay_order_id": f"order_{uuid.uuid4().hex[:14]}",
        "amount": int(body.amount * 100),   # paise
        "currency": body.currency,
        "status": "created",
    }


class VerifyIn(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


@router.post("/verify")
async def verify_payment(body: VerifyIn):
    # TODO: verify HMAC signature with key secret
    return {"verified": True, "payment_id": body.razorpay_payment_id}
