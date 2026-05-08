# `services/api` (FastAPI)

## Runtime notes (Windows)

### Recommended Python version
FastAPI depends on **Pydantic**, which uses a native extension (`pydantic-core`).
On **Python 3.14**, pip may attempt to compile from source (Rust toolchain required).

For the smoothest install experience on Windows, use **Python 3.12.x**.

## Run (SQLite, no Docker)

```powershell
cd services\api
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:NOYYA_DATABASE_URL="sqlite:///./noyya.db"
uvicorn app.main:app --reload --port 8000
```

## Run (Postgres/Timescale via Docker)

1) Start infra:

```powershell
cd infra
docker compose up -d
```

2) Start API:

```powershell
cd services\api
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:NOYYA_DATABASE_URL="postgresql+psycopg://postgres:postgres@localhost:5432/noyya"
uvicorn app.main:app --reload --port 8000
```

## Smoke test payloads

### Create a reading

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:8000/v1/sensors/readings" -ContentType "application/json" -Body (@{
  device_id="NOYYA-WQ-UKKADAM-01"
  observed_at=(Get-Date).ToUniversalTime().ToString("o")
  lat=11.0050
  lon=76.9610
  kind="water"
  metrics=@{ ph=7.2; turbidity_ntu=9.1; do_mg_l=5.8; tds_ppm=680; temp_c=29.4 }
} | ConvertTo-Json -Depth 5)
```

### Create an alert

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:8000/v1/alerts" -ContentType "application/json" -Body (@{
  severity="warning"
  category="water"
  title="Turbidity spike detected"
  description="Turbidity crossed threshold near Ukkadam stretch. Recommend field verification and upstream scan."
  lat=11.0050
  lon=76.9610
  source=@{ rule="threshold"; metric="turbidity_ntu"; threshold=8.0 }
} | ConvertTo-Json -Depth 5)
```

