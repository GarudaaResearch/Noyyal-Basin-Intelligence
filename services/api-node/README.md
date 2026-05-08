# `services/api-node` (No-Docker Alternate API)

This is a **Docker-free, Python-free** API you can run immediately on Windows.

## What it provides
Same MVP endpoints as the FastAPI service:

- `GET /health`
- `POST /v1/sensors/readings`
- `GET /v1/sensors/readings`
- `POST /v1/alerts`
- `GET /v1/alerts`

## Data storage
Local JSON database at `services/api-node/data/db.json`.

## Run

```powershell
cd services\api-node
npm install
npm run dev
```

Runs on `http://localhost:8000`.

