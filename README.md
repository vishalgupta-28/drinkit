# 🥃 DrinkIt — Hyperlocal Alcohol Delivery (Blinkit-style)

A microservices-based alcohol delivery platform with **zone-based pricing**
(e.g. Red Label = ₹1800 in Delhi, ₹1200 in Gurugram), a Blinkit-style
Next.js storefront, loyalty rewards (DrinkPoints), Spin & Win, live order
tracking over WebSocket, and background workers via RabbitMQ.

## Architecture

```
                 ┌──────────────┐
   Browser ─────▶│    nginx     │ :8080
                 └──────┬───────┘
        ┌───────────────┼────────────────────────────┐
        ▼               ▼                             ▼
  frontend :3001   api-gateway :3000           /socket.io → notification :8007
                        │
   ┌────────────────────┼─────────────────────────────────────┐
   ▼        ▼       ▼        ▼        ▼        ▼        ▼        ▼
 auth    location  shop   catalog  order   rider  payment  analytics
 :8001    :8002   :8003   :8004    :8005   :8006   :8008     :8009

 Shared infra:  PostgreSQL(+PostGIS) :5432 · Redis :6379 · RabbitMQ :5672/15672
```

| Service               | Stack                              | Port |
|-----------------------|------------------------------------|------|
| api-gateway           | Node + TypeScript + Express        | 3000 |
| auth-service          | Python + FastAPI (OTP)             | 8001 |
| location-service      | Python + FastAPI + PostGIS         | 8002 |
| shop-service          | Python + FastAPI                   | 8003 |
| catalog-service       | Python + FastAPI (**zone pricing**)| 8004 |
| order-service         | Node + TypeScript (RabbitMQ pub)   | 8005 |
| rider-service         | Node + TypeScript                  | 8006 |
| notification-service  | Node + TypeScript + Socket.io      | 8007 |
| payment-service       | Python + FastAPI (Razorpay)        | 8008 |
| analytics-service     | Python + FastAPI                   | 8009 |
| frontend              | Next.js 14 + Tailwind              | 3001 |

## Quick start

```bash
cp .env.example .env      # fill in API keys (works with placeholders in dev)
make dev                  # full stack with hot reload
```

Then open **http://localhost:8080** (via nginx) or **http://localhost:3001**
(frontend direct).

### Zone pricing demo
The seed data (`infra/postgres/init.sql`) creates the same products in Delhi and
Gurugram at different prices. Switch zones from the **LocationBar** in the app —
prices update live. `GET /api/catalog/products?zone=delhi` vs `?zone=gurugram`.

## Frontend only (no Docker)

```bash
cd frontend
npm install
npm run dev
```

The frontend ships with **mock data fallback** (`lib/mock.ts`), so every screen
renders even when the backend isn't running.

## What's fully built vs. scaffolded

**Fully working:** infra (compose/nginx/Makefile), Postgres schema + seed with
zone pricing, catalog-service (real zone-priced queries), the Node services
(gateway proxy, order→RabbitMQ, rider, socket.io notifier), and the frontend
Home / Rewards / Spin / Age Gate / Cart / OTP auth / order tracking screens,
plus all Zustand stores, React Query hooks, and the Blinkit theme.

**Scaffolded (working stubs to extend):** auth JWT minting, Twilio/Razorpay
integrations, alembic migrations, Google Maps live tracking, and a few
secondary pages (search, profile, gift, shop detail) marked with `ComingSoon`.

## Make targets

`make dev` · `make prod` · `make logs` · `make stop` · `make db-migrate`
· `make db-shell` · `make clean`
