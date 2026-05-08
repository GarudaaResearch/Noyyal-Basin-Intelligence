# Data Model (MVP + Extension Points)

## Design principles
- **Spatiotemporal first**: every observation/event has `time + location + provenance`.
- **Schema evolves**: use JSON for high-variance metrics, and promote stable fields to columns.
- **Evidence-ready**: enforcement-grade events keep immutable references to media and audit logs.

## MVP entities (implemented)

### `sensor_readings`
Purpose: unify water/air/soil/tree/camera/acoustic observations.

- `id` (UUID string)
- `device_id` (string)
- `observed_at` (timestamp with timezone)
- `lat`, `lon` (float)
- `kind` (water|air|soil|tree|camera|acoustic)
- `metrics` (JSONB; sensor payload)

### `alert_events`
Purpose: operational alerts produced by models/devices/users.

- `id` (UUID string)
- `created_at` (timestamp with timezone)
- `severity` (info|warning|critical)
- `category` (water|encroachment|tree|flood|groundwater|biodiversity)
- `title`, `description`
- `lat`, `lon` (optional)
- `source` (JSONB; pointers to model run, sensor, report, or media evidence)
- `status` (open|ack|closed)

## Extension tables (next)

### Assets & GIS catalog (PostGIS)
- `assets`: sensors, outfalls, check dams, tanks, wetlands, plantations
- `zones`: recharge zones, flood plains, encroachment buffers, biodiversity habitats
- `parcels`: land parcels / administrative boundaries (for encroachment workflows)

### Remote sensing catalog
- `imagery_scenes`: satellite/drone scenes metadata + storage URIs
- `derived_layers`: NDVI/NDWI/turbidity proxies, change-detection rasters

### AI artifacts
- `model_runs`: model version, features, metrics, explainability outputs
- `predictions`: forecast series (WQI, flood risk, groundwater stress)

### Evidence workflows
- `cases`: enforcement case lifecycle (create → assign → investigate → close)
- `evidence_items`: media clips, hashes, chain-of-custody metadata

