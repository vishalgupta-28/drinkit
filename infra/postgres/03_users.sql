-- ─────────────────────────────────────────────────────────────
-- DrinkIt — users table for real auth (bcrypt hashes + JWT subject)
-- Idempotent; auth-service also ensures this on startup.
-- ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email         TEXT UNIQUE NOT NULL,
    name          TEXT NOT NULL,
    password_hash TEXT NOT NULL,           -- bcrypt hash, never the raw password
    created_at    TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (lower(email));
