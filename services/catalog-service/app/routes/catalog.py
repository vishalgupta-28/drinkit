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


@router.get("/products", response_model=list[ProductOut])
async def list_products(
    zone: str = Query(..., description="zone slug, e.g. 'delhi' or 'gurugram'"),
    category: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """Return products with prices resolved for the requested zone.

    Same product yields a DIFFERENT price per zone (Delhi vs Gurugram).
    """
    sql = text(
        """
        SELECT p.id, p.name, p.brand, p.category, p.volume_ml,
               p.image_url, p.pairs_with,
               zp.price, zp.mrp, zp.stock, zp.shop_id
        FROM products p
        JOIN zone_prices zp ON zp.product_id = p.id
        JOIN zones z ON z.id = zp.zone_id
        WHERE z.slug = :zone
          AND (:category IS NULL OR p.category = :category)
        ORDER BY p.name
        """
    )
    rows = (await db.execute(sql, {"zone": zone, "category": category})).mappings().all()
    return [
        ProductOut(**{**row, "price": float(row["price"]),
                      "mrp": float(row["mrp"]) if row["mrp"] is not None else None,
                      "points_earned": _points(float(row["price"]))})
        for row in rows
    ]


@router.get("/products/{product_id}", response_model=ProductOut)
async def get_product(
    product_id: UUID,
    zone: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    sql = text(
        """
        SELECT p.id, p.name, p.brand, p.category, p.volume_ml,
               p.image_url, p.pairs_with,
               zp.price, zp.mrp, zp.stock, zp.shop_id
        FROM products p
        JOIN zone_prices zp ON zp.product_id = p.id
        JOIN zones z ON z.id = zp.zone_id
        WHERE p.id = :pid AND z.slug = :zone
        LIMIT 1
        """
    )
    row = (await db.execute(sql, {"pid": str(product_id), "zone": zone})).mappings().first()
    if not row:
        raise HTTPException(404, "Product not available in this zone")
    return ProductOut(**{**row, "price": float(row["price"]),
                         "mrp": float(row["mrp"]) if row["mrp"] is not None else None,
                         "points_earned": _points(float(row["price"]))})
