from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url_async: str = "postgresql+asyncpg://drinkit:drinkit_secret@postgres:5432/drinkit"
    redis_url: str = "redis://redis:6379/0"
    port: int = 8004


settings = Settings()
