import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

import cors from "cors";
import express from "express";

import { readDb, writeDb } from "./store.js";

const PORT = Number(process.env.PORT ?? 8000);

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Minimal dashboard (no build tools, no Docker, no Python)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "..", "public");
app.use("/", express.static(publicDir));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "noyyal-api-node" });
});

app.post("/v1/sensors/readings", (req, res) => {
  const body = req.body ?? {};

  const reading = {
    id: crypto.randomUUID(),
    device_id: String(body.device_id ?? ""),
    observed_at: String(body.observed_at ?? new Date().toISOString()),
    lat: Number(body.lat),
    lon: Number(body.lon),
    kind: String(body.kind ?? "water"),
    metrics: typeof body.metrics === "object" && body.metrics ? body.metrics : {},
  };

  if (!reading.device_id || !Number.isFinite(reading.lat) || !Number.isFinite(reading.lon)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const db = readDb();
  db.sensor_readings.unshift(reading);
  db.sensor_readings = db.sensor_readings.slice(0, 50_000);
  writeDb(db);
  res.json(reading);
});

app.get("/v1/sensors/readings", (req, res) => {
  const limit = Math.max(1, Math.min(2000, Number(req.query.limit ?? 200)));
  const deviceId = req.query.device_id ? String(req.query.device_id) : null;
  const kind = req.query.kind ? String(req.query.kind) : null;

  const db = readDb();
  let rows = db.sensor_readings ?? [];
  if (deviceId) rows = rows.filter((r) => r.device_id === deviceId);
  if (kind) rows = rows.filter((r) => r.kind === kind);
  res.json(rows.slice(0, limit));
});

app.post("/v1/alerts", (req, res) => {
  const body = req.body ?? {};

  const alert = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    severity: String(body.severity ?? "info"),
    category: String(body.category ?? "water"),
    title: String(body.title ?? ""),
    description: String(body.description ?? ""),
    lat: body.lat === null || body.lat === undefined ? null : Number(body.lat),
    lon: body.lon === null || body.lon === undefined ? null : Number(body.lon),
    source: typeof body.source === "object" && body.source ? body.source : {},
    status: "open",
  };

  if (!alert.title || !alert.description) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const db = readDb();
  db.alert_events.unshift(alert);
  db.alert_events = db.alert_events.slice(0, 50_000);
  writeDb(db);
  res.json(alert);
});

app.get("/v1/alerts", (req, res) => {
  const limit = Math.max(1, Math.min(2000, Number(req.query.limit ?? 200)));
  const status = req.query.status ? String(req.query.status) : null;
  const category = req.query.category ? String(req.query.category) : null;

  const db = readDb();
  let rows = db.alert_events ?? [];
  if (status) rows = rows.filter((a) => a.status === status);
  if (category) rows = rows.filter((a) => a.category === category);
  res.json(rows.slice(0, limit));
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[noyyal-api-node] listening on http://localhost:${PORT}`);
});

