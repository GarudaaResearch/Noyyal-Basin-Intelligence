from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import AlertEvent, SensorReading
from app.schemas import AlertEventCreate, AlertEventOut, SensorReadingIn, SensorReadingOut

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok", "service": "noyyal-api"}


@router.post("/v1/sensors/readings", response_model=SensorReadingOut)
def ingest_sensor_reading(payload: SensorReadingIn, db: Session = Depends(get_db)):
    row = SensorReading(**payload.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    return SensorReadingOut(id=row.id, **payload.model_dump())


@router.get("/v1/sensors/readings", response_model=list[SensorReadingOut])
def list_sensor_readings(
    device_id: str | None = None,
    kind: str | None = None,
    limit: int = 200,
    db: Session = Depends(get_db),
):
    limit = max(1, min(2000, limit))
    stmt = select(SensorReading).order_by(SensorReading.observed_at.desc()).limit(limit)
    if device_id:
        stmt = stmt.where(SensorReading.device_id == device_id)
    if kind:
        stmt = stmt.where(SensorReading.kind == kind)
    rows = db.execute(stmt).scalars().all()
    return [
        SensorReadingOut(
            id=r.id,
            device_id=r.device_id,
            observed_at=r.observed_at,
            lat=r.lat,
            lon=r.lon,
            kind=r.kind,  # type: ignore[arg-type]
            metrics=r.metrics,
        )
        for r in rows
    ]


@router.post("/v1/alerts", response_model=AlertEventOut)
def create_alert(payload: AlertEventCreate, db: Session = Depends(get_db)):
    row = AlertEvent(
        created_at=datetime.now(tz=timezone.utc),
        status="open",
        **payload.model_dump(),
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return AlertEventOut(
        id=row.id,
        created_at=row.created_at,
        severity=row.severity,  # type: ignore[arg-type]
        category=row.category,  # type: ignore[arg-type]
        title=row.title,
        description=row.description,
        lat=row.lat,
        lon=row.lon,
        source=row.source,
        status=row.status,  # type: ignore[arg-type]
    )


@router.get("/v1/alerts", response_model=list[AlertEventOut])
def list_alerts(
    status: str | None = None,
    category: str | None = None,
    limit: int = 200,
    db: Session = Depends(get_db),
):
    limit = max(1, min(2000, limit))
    stmt = select(AlertEvent).order_by(AlertEvent.created_at.desc()).limit(limit)
    if status:
        stmt = stmt.where(AlertEvent.status == status)
    if category:
        stmt = stmt.where(AlertEvent.category == category)
    rows = db.execute(stmt).scalars().all()
    return [
        AlertEventOut(
            id=r.id,
            created_at=r.created_at,
            severity=r.severity,  # type: ignore[arg-type]
            category=r.category,  # type: ignore[arg-type]
            title=r.title,
            description=r.description,
            lat=r.lat,
            lon=r.lon,
            source=r.source,
            status=r.status,  # type: ignore[arg-type]
        )
        for r in rows
    ]

