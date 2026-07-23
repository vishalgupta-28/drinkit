from fastapi import APIRouter, Depends, Query
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from ..config import settings

router = APIRouter(prefix="/location", tags=["location"])

engine = create_async_engine(settings.database_url_async, pool_pre_ping=True)
SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_db():
    async with SessionLocal() as s:
        yield s


@router.get("/zones")
async def list_zones(db: AsyncSession = Depends(get_db)):
    rows = (await db.execute(text("SELECT id, name, slug, city FROM zones ORDER BY name"))).mappings().all()
    return [dict(r) for r in rows]


@router.get("/resolve")
async def resolve_zone(
    lat: float = Query(...),
    lng: float = Query(...),
    db: AsyncSession = Depends(get_db),
):
    """Resolve a lat/lng to the nearest serviceable zone (via nearest shop)."""
    sql = text(
        """
        SELECT z.slug, z.name,
               ST_Distance(s.location, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography) AS meters
        FROM shops s JOIN zones z ON z.id = s.zone_id
        ORDER BY meters ASC
        LIMIT 1
        """
    )
    row = (await db.execute(sql, {"lat": lat, "lng": lng})).mappings().first()
    return dict(row) if row else {"slug": None, "name": "Not serviceable"}
