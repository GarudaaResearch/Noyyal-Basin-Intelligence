from __future__ import annotations

from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, Float, Index, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.types import JSON


class Base(DeclarativeBase):
    pass


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    device_id: Mapped[str] = mapped_column(String(64), index=True)
    observed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    lat: Mapped[float] = mapped_column(Float)
    lon: Mapped[float] = mapped_column(Float)
    kind: Mapped[str] = mapped_column(String(32), index=True)  # water|air|soil|tree|camera|acoustic
    metrics: Mapped[dict] = mapped_column(JSON().with_variant(JSONB, "postgresql"))


Index("ix_sensor_readings_device_time", SensorReading.device_id, SensorReading.observed_at)


class AlertEvent(Base):
    __tablename__ = "alert_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    severity: Mapped[str] = mapped_column(String(16), index=True)  # info|warning|critical
    category: Mapped[str] = mapped_column(String(32), index=True)  # water|encroachment|tree|flood|groundwater|biodiversity
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)
    lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    lon: Mapped[float | None] = mapped_column(Float, nullable=True)
    source: Mapped[dict] = mapped_column(JSON().with_variant(JSONB, "postgresql"))  # model/device/report reference
    status: Mapped[str] = mapped_column(String(16), default="open", index=True)  # open|ack|closed

