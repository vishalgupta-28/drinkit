from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine, AsyncSession
from .config import settings

engine = create_async_engine(settings.database_url_async, echo=False, pool_pre_ping=True)
SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_db() -> AsyncSession:
    async with SessionLocal() as session:
        yield session
