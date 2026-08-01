from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from uuid import UUID

from ..db import get_db
from ..schemas.product import ProductOut

router = APIRouter(prefix="/catalog", tags=["catalog"])


def _points(price: float) -> int:
    # 1 DrinkPoint per ₹10 spent
    return int(price // 10)


# Price for a state = product base price × that state's tax multiplier,
# rounded to the nearest ₹10. Same product => different price per state.
_SELECT = """
    SELECT p.id, p.name, p.brand, p.category, p.volume_ml,
           p.image_url, p.pairs_with,
           ROUND(p.base_price * z.tax_multiplier / 10.0) * 10 AS price,
           p.base_mrp AS mrp,
           p.stock,
           z.is_serviceable
    FROM products p
    CROSS JOIN zones z
    WHERE z.slug = :zone
"""


def _to_out(row) -> ProductOut:
    price = float(row["price"])
    return ProductOut(
        id=row["id"], name=row["name"], brand=row["brand"], category=row["category"],
        volume_ml=row["volume_ml"], image_url=row["image_url"], pairs_with=row["pairs_with"],
        price=price,
        mrp=float(row["mrp"]) if row["mrp"] is not None else None,
        stock=row["stock"],
        is_serviceable=row["is_serviceable"],
        points_earned=_points(price),
    )


@router.get("/products", response_model=list[ProductOut])
async def list_products(
    zone: str = Query(..., description="state/zone slug, e.g. 'delhi', 'kerala', 'goa'"),
    category: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """Return every product priced for the requested state.

    Price is computed from each product's base price and the state's tax
    multiplier, so the same bottle costs a different amount in every state.
    """
    sql = text(
        _SELECT
        + """
          AND (CAST(:category AS text) IS NULL OR p.category = CAST(:category AS text))
        ORDER BY p.name
        """
    )
    rows = (await db.execute(sql, {"zone": zone, "category": category})).mappings().all()
    return [_to_out(r) for r in rows]


@router.get("/products/{product_id}", response_model=ProductOut)
async def get_product(
    product_id: UUID,
    zone: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    sql = text(_SELECT + " AND p.id = :pid LIMIT 1")
    row = (await db.execute(sql, {"pid": str(product_id), "zone": zone})).mappings().first()
    if not row:
        raise HTTPException(404, "Product not available in this state")
    return _to_out(row)
