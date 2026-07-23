# ─────────────────────────────────────────────────────────────
# DrinkIt — developer commands
# ─────────────────────────────────────────────────────────────
COMPOSE      = docker compose
COMPOSE_DEV  = docker compose -f docker-compose.yml -f docker-compose.dev.yml

.PHONY: dev prod build stop down logs ps db-migrate db-shell redis-cli clean

## dev: start full stack with hot reload
dev:
	$(COMPOSE_DEV) up --build

## prod: start full stack (production build)
prod:
	$(COMPOSE) up --build -d

## build: build all images without starting
build:
	$(COMPOSE) build

## stop: stop all containers (keep data)
stop:
	$(COMPOSE) stop

## down: stop and remove containers/networks (keep volumes)
down:
	$(COMPOSE) down

## logs: tail all service logs
logs:
	$(COMPOSE) logs -f --tail=100

## ps: list running containers
ps:
	$(COMPOSE) ps

## db-migrate: run alembic migrations across python services
db-migrate:
	$(COMPOSE) exec auth-service     alembic upgrade head
	$(COMPOSE) exec location-service alembic upgrade head
	$(COMPOSE) exec shop-service     alembic upgrade head
	$(COMPOSE) exec catalog-service  alembic upgrade head
	$(COMPOSE) exec payment-service  alembic upgrade head

## db-shell: open psql shell
db-shell:
	$(COMPOSE) exec postgres psql -U drinkit -d drinkit

## redis-cli: open redis shell
redis-cli:
	$(COMPOSE) exec redis redis-cli

## clean: remove containers AND volumes (DESTROYS DATA)
clean:
	$(COMPOSE) down -v
