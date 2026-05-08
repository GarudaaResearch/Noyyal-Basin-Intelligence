from __future__ import annotations

from fastapi import FastAPI

from app.api import router
from app.models import Base
from app.db import engine
from app.settings import settings


def create_app() -> FastAPI:
    app = FastAPI(title=settings.api_title, version=settings.api_version)
    app.include_router(router)
    return app


app = create_app()


@app.on_event("startup")
def _startup():
    # MVP: create tables automatically (replace with Alembic migrations in production)
    Base.metadata.create_all(bind=engine)

