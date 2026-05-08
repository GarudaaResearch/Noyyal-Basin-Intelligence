from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="NOYYA_", env_file=".env", extra="ignore")

    environment: str = "local"
    api_title: str = "Noyyal Smart Basin Intelligence API"
    api_version: str = "0.1.0"

    # Default to SQLite so the API can run even when Docker/Postgres isn't available.
    # For production and full GIS/Timescale features, set:
    #   NOYYA_DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/noyya
    database_url: str = "sqlite:///./noyya.db"


settings = Settings()

