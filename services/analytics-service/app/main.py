from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import analytics

app = FastAPI(title="DrinkIt · analytics-service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analytics.router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "analytics-service"}
