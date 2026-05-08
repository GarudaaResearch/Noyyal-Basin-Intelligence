# `infra` (local infrastructure)

This folder provides local dependencies for the platform.

## Services
- `db`: TimescaleDB/ PostgreSQL (used for time-series + GIS extensions in later phases)
- `mqtt`: Mosquitto broker (IoT telemetry ingress)

## Run

```powershell
cd infra
docker compose up -d
docker compose ps
```

## Troubleshooting (Windows)

If `docker compose` hangs or errors like:

- `failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine`

Start **Docker Desktop** and ensure the engine is running, then retry.

