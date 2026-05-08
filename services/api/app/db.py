from __future__ import annotations

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.settings import settings

connect_args = {}
if settings.database_url.startswith("sqlite:///"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    connect_args=connect_args,
)


def get_db() -> Generator[Session, None, None]:
    db = Session(bind=engine)
    try:
        yield db
    finally:
        db.close()

