# AI-Driven Smart Ecological Monitoring and Tree Intelligence System
## Noyyal River Basin, Coimbatore (Enterprise MVP Scaffold)

This repository contains a **production-oriented MVP scaffold** for an AI-powered environmental intelligence platform covering:

- Real-time river health monitoring (IoT + anomaly detection)
- Tree analytics and biodiversity intelligence (drone/satellite + AI)
- Encroachment / illegal dumping detection (edge CV)
- Predictive analytics (pollution, flood/drought, groundwater)
- GIS dashboard layers and a Digital Twin foundation

### Repo layout

- `infra/`: local infrastructure (TimescaleDB+PostGIS, MQTT)
- `services/api/`: FastAPI backend (OpenAPI, ingestion, alerts, GIS endpoints)
- `apps/web/`: Next.js web dashboard (map UI + alert console)
- `docs/`: architecture, data model, and API specifications

### Prerequisites

- Docker Desktop (recommended for TimescaleDB+PostGIS; optional for API-only MVP)
- Node.js 20+ (you have Node installed)
- Python 3.11+ recommended (your Python is newer; this MVP pins dependencies)

### Quick start (local)

1) Start API (no Docker alternate, recommended on your machine):

```powershell
cd services\api-node
npm install
npm run dev
```

2) Open the local dashboard:

- Dashboard: `http://localhost:8000/`
- API health: `http://localhost:8000/health`

### Optional: Next.js dashboard (later)

If `apps/web` dependency install is slow/blocked on your network, you can skip it.
When it works, run:

```powershell
cd apps\web
npm install
$env:NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"
npm run dev
```

### Optional: Docker-based infrastructure (later)

If Docker Desktop becomes available, you can start TimescaleDB+MQTT:

```powershell
cd infra
docker compose up -d
```

### Optional: Python FastAPI service (later)

```powershell
cd services\api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# Default DB is SQLite (no Docker required). To use Postgres/Timescale, set:
#   $env:NOYYA_DATABASE_URL="postgresql+psycopg://postgres:postgres@localhost:5432/noyya"
uvicorn app.main:app --reload --port 8000
```

### Endpoints

- API health: `http://localhost:8000/health`
- Web: `http://localhost:3000`

### Notes

This scaffold is intentionally modular so you can add:

- Kafka/Redpanda streaming, MLflow, feature store
- GeoServer / tile services
- Edge agent deployments (Jetson/RPi)
- Model serving (TorchServe/Triton) and retraining pipelines

