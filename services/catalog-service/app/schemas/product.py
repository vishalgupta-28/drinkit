from pydantic import BaseModel
from uuid import UUID
from typing import Optional


class ProductOut(BaseModel):
    id: UUID
    name: str
    brand: Optional[str] = None
    category: str
    volume_ml: Optional[int] = None
    image_url: Optional[str] = None
    pairs_with: Optional[str] = None
    # Zone-specific fields (resolved for the requested zone)
    price: float
    mrp: Optional[float] = None
    stock: int
    shop_id: Optional[UUID] = None
    # Convenience for the UI
    points_earned: int  # 1 pt per ₹10
