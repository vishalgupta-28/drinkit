from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from .routes import auth
from .db import engine

app = FastAPI(title="DrinkIt · auth-service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)

_ENSURE_USERS = """
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email         TEXT UNIQUE NOT NULL,
    name          TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT now()
);
"""


@app.on_event("startup")
async def ensure_schema():
    # Guarantees the users table exists even against an existing DB volume
    # (where the init SQL migrations won't re-run).
    async with engine.begin() as conn:
        for stmt in filter(None, (s.strip() for s in _ENSURE_USERS.split(";"))):
            await conn.execute(text(stmt))


@app.get("/health")
async def health():
    return {"status": "ok", "service": "auth-service"}
