from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


SensorKind = Literal["water", "air", "soil", "tree", "camera", "acoustic"]


class SensorReadingIn(BaseModel):
    device_id: str = Field(min_length=2, max_length=64)
    observed_at: datetime
    lat: float
    lon: float
    kind: SensorKind
    metrics: dict[str, Any]


class SensorReadingOut(SensorReadingIn):
    id: str


AlertSeverity = Literal["info", "warning", "critical"]
AlertCategory = Literal["water", "encroachment", "tree", "flood", "groundwater", "biodiversity"]
AlertStatus = Literal["open", "ack", "closed"]


class AlertEventOut(BaseModel):
    id: str
    created_at: datetime
    severity: AlertSeverity
    category: AlertCategory
    title: str
    description: str
    lat: float | None = None
    lon: float | None = None
    source: dict[str, Any]
    status: AlertStatus


class AlertEventCreate(BaseModel):
    severity: AlertSeverity
    category: AlertCategory
    title: str
    description: str
    lat: float | None = None
    lon: float | None = None
    source: dict[str, Any] = Field(default_factory=dict)

