type AlertEvent = {
  id: string;
  created_at: string;
  severity: "info" | "warning" | "critical";
  category: "water" | "encroachment" | "tree" | "flood" | "groundwater" | "biodiversity";
  title: string;
  description: string;
  lat?: number | null;
  lon?: number | null;
  source: Record<string, unknown>;
  status: "open" | "ack" | "closed";
};

type SensorReading = {
  id: string;
  device_id: string;
  observed_at: string;
  lat: number;
  lon: number;
  kind: "water" | "air" | "soil" | "tree" | "camera" | "acoustic";
  metrics: Record<string, unknown>;
};

async function getJSON<T>(path: string): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
  const res = await fetch(`${base}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return (await res.json()) as T;
}

function Pill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80">
      {label}
    </span>
  );
}

export default async function HomePage() {
  const [alerts, readings] = await Promise.all([
    getJSON<AlertEvent[]>("/v1/alerts?limit=20"),
    getJSON<SensorReading[]>("/v1/sensors/readings?limit=20"),
  ]);

  return (
    <main className="space-y-8">
      <header className="space-y-2">
        <div className="text-sm text-white/70">AI-Powered Environmental Intelligence</div>
        <h1 className="text-2xl font-semibold">Noyyal Smart River Basin Intelligence</h1>
        <div className="flex flex-wrap gap-2">
          <Pill label="Real-time River Health" />
          <Pill label="Tree & Biodiversity Intelligence" />
          <Pill label="Encroachment & Dumping Detection" />
          <Pill label="Climate Resilience + Groundwater" />
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-medium">Recent Alerts</h2>
            <span className="text-xs text-white/60">{alerts.length} items</span>
          </div>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-sm text-white/60">No alerts yet. Create one via API.</div>
            ) : (
              alerts.map((a) => (
                <div key={a.id} className="rounded-lg border border-white/10 bg-black/20 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">{a.title}</div>
                      <div className="text-xs text-white/60">{new Date(a.created_at).toLocaleString()}</div>
                    </div>
                    <div className="flex gap-2">
                      <Pill label={a.severity} />
                      <Pill label={a.category} />
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-white/80">{a.description}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-medium">Latest Sensor Readings</h2>
            <span className="text-xs text-white/60">{readings.length} items</span>
          </div>
          <div className="space-y-3">
            {readings.length === 0 ? (
              <div className="text-sm text-white/60">No readings yet. Ingest one via API.</div>
            ) : (
              readings.map((r) => (
                <div key={r.id} className="rounded-lg border border-white/10 bg-black/20 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">
                        {r.device_id} <span className="text-white/60">({r.kind})</span>
                      </div>
                      <div className="text-xs text-white/60">{new Date(r.observed_at).toLocaleString()}</div>
                    </div>
                    <Pill label={`${r.lat.toFixed(4)}, ${r.lon.toFixed(4)}`} />
                  </div>
                  <pre className="mt-2 overflow-x-auto rounded bg-black/30 p-2 text-xs text-white/80">
                    {JSON.stringify(r.metrics, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-lg font-medium">Next Modules (wired to this foundation)</h2>
        <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-black/20 p-3">
            <div className="text-sm font-medium">GIS Layers</div>
            <div className="text-sm text-white/70">PostGIS assets, risk zones, riparian buffers, satellite overlays.</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/20 p-3">
            <div className="text-sm font-medium">Tree Intelligence</div>
            <div className="text-sm text-white/70">Canopy segmentation, native/invasive detection, carbon, survival.</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/20 p-3">
            <div className="text-sm font-medium">Digital Twin</div>
            <div className="text-sm text-white/70">Scenario runs: flow, pollution spread, flood/drought, restoration impact.</div>
          </div>
        </div>
      </section>
    </main>
  );
}

