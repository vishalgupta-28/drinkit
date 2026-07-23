from fastapi import APIRouter

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary")
async def summary():
    """Scaffold KPIs. In production these are computed from order events
    consumed off RabbitMQ and aggregated in Postgres."""
    return {
        "orders_today": 128,
        "gmv_today": 184230,
        "active_riders": 14,
        "top_category": "whisky",
    }
