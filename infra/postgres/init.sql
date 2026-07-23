-- ─────────────────────────────────────────────────────────────
-- DrinkIt — Postgres bootstrap (runs once on first container start)
-- ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Zones (Delhi, Gurugram, ...) drive location-based pricing ──
CREATE TABLE IF NOT EXISTS zones (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,             -- "Delhi NCR", "Gurugram"
    slug        TEXT UNIQUE NOT NULL,      -- "delhi", "gurugram"
    city        TEXT NOT NULL,
    boundary    GEOGRAPHY(POLYGON, 4326),  -- optional service area
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── Shops ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shops (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id     UUID REFERENCES zones(id) ON DELETE SET NULL,
    name        TEXT NOT NULL,             -- "Sharma Wines"
    address     TEXT NOT NULL,
    phone       TEXT,
    location    GEOGRAPHY(POINT, 4326),    -- lat/lng for distance queries
    is_open     BOOLEAN DEFAULT true,
    rating      NUMERIC(2,1) DEFAULT 4.5,
    created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_shops_location ON shops USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_shops_zone ON shops (zone_id);

-- ── Products (global catalog) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,             -- "Red Label Whisky"
    brand       TEXT,                      -- "Johnnie Walker"
    category    TEXT NOT NULL,             -- beer | whisky | wine | vodka | rum | gin
    volume_ml   INT,                       -- 750
    image_url   TEXT,
    pairs_with  TEXT,                      -- "Pizza 🍕"
    created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);

-- ── Zone pricing: SAME product, DIFFERENT price per zone ──────
-- Red Label = ₹1800 in Delhi, ₹1200 in Gurugram
CREATE TABLE IF NOT EXISTS zone_prices (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    zone_id     UUID NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
    shop_id     UUID REFERENCES shops(id) ON DELETE CASCADE,
    price       NUMERIC(10,2) NOT NULL,    -- current selling price
    mrp         NUMERIC(10,2),             -- struck-through original
    stock       INT DEFAULT 0,             -- drives "Only 2 left!"
    UNIQUE (product_id, zone_id, shop_id)
);
CREATE INDEX IF NOT EXISTS idx_zone_prices_lookup ON zone_prices (zone_id, product_id);

-- ── Seed data ─────────────────────────────────────────────────
INSERT INTO zones (id, name, slug, city) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Delhi NCR', 'delhi',    'Delhi'),
    ('22222222-2222-2222-2222-222222222222', 'Gurugram',  'gurugram', 'Gurugram')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shops (id, zone_id, name, address, phone, location) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111',
        'Sharma Wines', 'Connaught Place, New Delhi', '+91-9811100000',
        ST_SetSRID(ST_MakePoint(77.2167, 28.6315), 4326)),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222',
        'Cyber Hub Liquor', 'DLF Cyber City, Gurugram', '+91-9822200000',
        ST_SetSRID(ST_MakePoint(77.0888, 28.4959), 4326))
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, brand, category, volume_ml, pairs_with) VALUES
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Red Label Whisky', 'Johnnie Walker', 'whisky', 750, 'Pizza 🍕'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Kingfisher Premium', 'Kingfisher', 'beer', 650, 'Wings 🍗'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Jacob''s Creek Shiraz', 'Jacob''s Creek', 'wine', 750, 'Cheese 🧀')
ON CONFLICT DO NOTHING;

-- Same product, different price by zone
INSERT INTO zone_prices (product_id, zone_id, shop_id, price, mrp, stock) VALUES
    -- Red Label: Delhi ₹1800, Gurugram ₹1200
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1800, 1900, 12),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1200, 1900, 2),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 190, 220, 40),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 170, 220, 30),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 950, 1100, 8),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 880, 1100, 5)
ON CONFLICT DO NOTHING;
