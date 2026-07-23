from fastapi import APIRouter, Depends, Query
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from ..config import settings

router = APIRouter(prefix="/shops", tags=["shops"])

engine = create_async_engine(settings.database_url_async, pool_pre_ping=True)
SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_db():
    async with SessionLocal() as s:
        yield s


@router.get("")
async def list_shops(zone: str = Query(...), db: AsyncSession = Depends(get_db)):
    sql = text(
        """
        SELECT s.id, s.name, s.address, s.phone, s.rating, s.is_open,
               ST_Y(s.location::geometry) AS lat, ST_X(s.location::geometry) AS lng
        FROM shops s JOIN zones z ON z.id = s.zone_id
        WHERE z.slug = :zone
        ORDER BY s.rating DESC
        """
    )
    rows = (await db.execute(sql, {"zone": zone})).mappings().all()
    return [dict(r) for r in rows]


@router.get("/{shop_id}")
async def get_shop(shop_id: str, db: AsyncSession = Depends(get_db)):
    sql = text(
        """
        SELECT s.id, s.name, s.address, s.phone, s.rating, s.is_open,
               ST_Y(s.location::geometry) AS lat, ST_X(s.location::geometry) AS lng
        FROM shops s WHERE s.id = :id
        """
    )
    row = (await db.execute(sql, {"id": shop_id})).mappings().first()
    return dict(row) if row else {}
