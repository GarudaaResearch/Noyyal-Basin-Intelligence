# Architecture (Enterprise Reference)

## Purpose
This platform is a **Smart River Basin Intelligence Platform** for the Noyyal River Basin (Coimbatore/Tiruppur corridor) supporting:

- **Real-time river health monitoring** (IoT + edge + streaming)
- **Tree analytics & biodiversity intelligence** (drone/satellite + AI)
- **Encroachment / illegal dumping detection** (computer vision + evidence workflows)
- **Predictive environmental intelligence** (pollution, flood/drought, groundwater)
- **Digital Twin** (scenario simulation for restoration planning)
- **Decision support** (alerts + restoration recommendations + SDG/ESG reporting)

## High-level system view

### Ingestion sources
- **IoT stations**: water/air/soil/tree sensors
- **Edge cameras**: dumping/foam/outfall activity/sand-mining indicators
- **Bioacoustic nodes**: biodiversity monitoring
- **Drone surveys**: RGB/NDVI/thermal/LiDAR (as available)
- **Satellite**: Sentinel/Landsat/MODIS + ISRO layers (as accessible)
- **External**: weather/rainfall, CPCB/WRD datasets, citizen reporting

### Core platform services
- **Telemetry gateway**: MQTT ingestion + validation + buffering
- **Stream processing**: anomaly detection, derived indices (WQI), event generation
- **Geospatial intelligence**: PostGIS + vector/raster catalog, risk zoning, overlays
- **AI services**:
  - Water intelligence (WQI forecast, hotspot detection, contamination risk)
  - Tree intelligence (counting, species/native-vs-invasive, health, carbon)
  - Biodiversity intelligence (acoustic species richness, habitat health)
  - Encroachment/CV enforcement (change detection + evidence packs)
- **Alerting**: multi-channel delivery + triage workflow
- **Digital Twin**: stateful basin model + scenario engine

### Storage
- **Time-series**: TimescaleDB (sensor readings, derived indices)
- **Geospatial**: PostGIS (assets, zones, buffers, parcels, waterways)
- **Object**: imagery/video, orthomosaics, model artifacts
- **Search**: event/evidence retrieval

## Non-functional requirements (government-grade)
- **Resilience**: edge store-and-forward, queue buffering, idempotent ingestion
- **Security**: device identity, RBAC/ABAC, audit logs, immutable evidence retention
- **Data quality**: calibration registry, drift detection, trust scoring, provenance
- **Observability**: metrics/traces/logs, alert SLOs (critical < 60s target)
- **Scalability**: multi-tenant basin support for national blueprint reuse

## MVP in this repository
This repo implements a minimal backbone:

- `infra/`: TimescaleDB (Postgres) + MQTT broker
- `services/api/`: FastAPI API for sensor readings and alerts
- `apps/web/`: Next.js dashboard showing readings + alerts

Future modules plug into this backbone through:

- the database schema (spatiotemporal primitives)
- event/alert contracts
- geospatial assets catalog

