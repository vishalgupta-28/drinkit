-- ─────────────────────────────────────────────────────────────
-- DrinkIt — state-wise pricing + serviceability (idempotent migration)
-- Adds every Indian state/UT as a delivery zone. Price is derived from a
-- per-state tax multiplier applied to each product's base price, so alcohol
-- costs a DIFFERENT amount in every state (as it does in reality).
-- Dry states are marked non-serviceable and cannot be ordered to.
-- ─────────────────────────────────────────────────────────────

-- ── products: carry a base price (Delhi = baseline) ───────────
ALTER TABLE products ADD COLUMN IF NOT EXISTS base_price NUMERIC(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS base_mrp   NUMERIC(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock      INT DEFAULT 25;

-- Backfill base price from the existing Delhi zone_prices rows
UPDATE products p
SET base_price = zp.price, base_mrp = COALESCE(zp.mrp, zp.price * 1.1)
FROM zone_prices zp
JOIN zones z ON z.id = zp.zone_id
WHERE zp.product_id = p.id AND z.slug = 'delhi' AND p.base_price IS NULL;

-- Any product without a Delhi row gets a sane default
UPDATE products SET base_price = 1000 WHERE base_price IS NULL;
UPDATE products SET base_mrp = ROUND(base_price * 1.1) WHERE base_mrp IS NULL;

-- ── zones: per-state tax multiplier + serviceability ──────────
ALTER TABLE zones ADD COLUMN IF NOT EXISTS state          TEXT;
ALTER TABLE zones ADD COLUMN IF NOT EXISTS tax_multiplier NUMERIC(5,3) DEFAULT 1.000;
ALTER TABLE zones ADD COLUMN IF NOT EXISTS is_serviceable BOOLEAN DEFAULT true;

-- Keep the two original zones consistent with the base pricing
UPDATE zones SET state = 'Delhi',   tax_multiplier = 1.000 WHERE slug = 'delhi';
UPDATE zones SET state = 'Haryana', tax_multiplier = 0.667 WHERE slug = 'gurugram';

-- ── All states / UTs ──────────────────────────────────────────
-- multiplier ≈ relative liquor tax burden (illustrative, tune freely).
-- is_serviceable = false for dry states (delivery legally prohibited).
INSERT INTO zones (name, slug, city, state, tax_multiplier, is_serviceable) VALUES
  ('Maharashtra',        'maharashtra',   'Mumbai',            'Maharashtra',        1.200, true),
  ('Karnataka',          'karnataka',     'Bengaluru',         'Karnataka',          1.300, true),
  ('Kerala',             'kerala',        'Thiruvananthapuram','Kerala',             1.350, true),
  ('Tamil Nadu',         'tamil-nadu',    'Chennai',           'Tamil Nadu',         1.100, true),
  ('Telangana',          'telangana',     'Hyderabad',         'Telangana',          1.150, true),
  ('Andhra Pradesh',     'andhra-pradesh','Amaravati',         'Andhra Pradesh',     1.250, true),
  ('Uttar Pradesh',      'uttar-pradesh', 'Lucknow',           'Uttar Pradesh',      0.950, true),
  ('Rajasthan',          'rajasthan',     'Jaipur',            'Rajasthan',          1.000, true),
  ('Punjab',             'punjab',        'Chandigarh',        'Punjab',             0.900, true),
  ('West Bengal',        'west-bengal',   'Kolkata',           'West Bengal',        1.050, true),
  ('Madhya Pradesh',     'madhya-pradesh','Bhopal',            'Madhya Pradesh',     1.050, true),
  ('Odisha',             'odisha',        'Bhubaneswar',       'Odisha',             1.000, true),
  ('Chhattisgarh',       'chhattisgarh',  'Raipur',            'Chhattisgarh',       1.050, true),
  ('Jharkhand',          'jharkhand',     'Ranchi',            'Jharkhand',          1.000, true),
  ('Assam',              'assam',         'Guwahati',          'Assam',              0.950, true),
  ('Uttarakhand',        'uttarakhand',   'Dehradun',          'Uttarakhand',        0.920, true),
  ('Himachal Pradesh',   'himachal',      'Shimla',            'Himachal Pradesh',   0.850, true),
  ('Goa',                'goa',           'Panaji',            'Goa',                0.550, true),
  ('Jammu & Kashmir',    'jk',            'Srinagar',          'Jammu & Kashmir',    1.000, true),
  ('Chandigarh',         'chandigarh',    'Chandigarh',        'Chandigarh',         0.800, true),
  ('Puducherry',         'puducherry',    'Puducherry',        'Puducherry',         0.600, true),
  ('Manipur',            'manipur',       'Imphal',            'Manipur',            1.000, true),
  ('Meghalaya',          'meghalaya',     'Shillong',          'Meghalaya',          0.950, true),
  ('Tripura',            'tripura',       'Agartala',          'Tripura',            0.980, true),
  ('Arunachal Pradesh',  'arunachal',     'Itanagar',          'Arunachal Pradesh',  0.960, true),
  ('Sikkim',             'sikkim',        'Gangtok',           'Sikkim',             0.900, true),
  -- Dry states — delivery prohibited by law
  ('Gujarat',            'gujarat',       'Gandhinagar',       'Gujarat',            1.000, false),
  ('Bihar',              'bihar',         'Patna',             'Bihar',              1.000, false),
  ('Nagaland',           'nagaland',      'Kohima',            'Nagaland',           1.000, false),
  ('Mizoram',            'mizoram',       'Aizawl',            'Mizoram',            1.000, false),
  ('Lakshadweep',        'lakshadweep',   'Kavaratti',         'Lakshadweep',        1.000, false)
ON CONFLICT (slug) DO NOTHING;
