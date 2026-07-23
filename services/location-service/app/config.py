from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url_async: str = "postgresql+asyncpg://drinkit:drinkit_secret@postgres:5432/drinkit"
    redis_url: str = "redis://redis:6379/0"
    rabbitmq_url: str = "amqp://drinkit:drinkit_secret@rabbitmq:5672/"
    jwt_secret: str = "change_me"
    jwt_expiry: int = 3600
    port: int = 8002


settings = Settings()
