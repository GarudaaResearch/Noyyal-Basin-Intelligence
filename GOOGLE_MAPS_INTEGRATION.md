# Google Maps Integration Guide

## Overview
The dashboard currently uses **Leaflet.js** with OpenStreetMap tiles as a free, open-source alternative. To add Google Maps integration, follow these steps.

## Option 1: Google Maps with API Key (Recommended)

### Step 1: Obtain Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Maps Static API
   - Geocoding API (optional)
4. Create API key from Credentials section
5. Restrict key to HTTP referrers: `localhost:8000`

### Step 2: Update index.html

Replace the Leaflet script with Google Maps:

```html
<!-- Remove or comment out Leaflet -->
<!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script> -->

<!-- Add Google Maps -->
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=marker"></script>
```

### Step 3: Replace Map Initialization Code

**Remove:**
```javascript
function initMap() {
  const defaultLat = 11.0036;
  const defaultLon = 76.9655;

  ds.map = L.map("map", {
    center: [defaultLat, defaultLon],
    zoom: 12,
    attributionControl: false,
    zoomControl: false,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(ds.map);
  // ... rest of code
}
```

**Add:**
```javascript
function initMap() {
  const defaultLat = 11.0036;
  const defaultLon = 76.9655;

  ds.map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: defaultLat, lng: defaultLon },
    mapTypeId: "hybrid", // hybrid, roadmap, satellite, terrain
    fullscreenControl: true,
    zoomControl: true,
    mapTypeControl: true,
  });

  window.mapInstance = ds.map;
  ds.mapCenter = { lat: defaultLat, lng: defaultLon };
}
```

### Step 4: Update Marker Creation

**For Sensors:**
```javascript
function createSensorMarker(reading) {
  const marker = new google.maps.marker.AdvancedMarkerElement({
    map: ds.map,
    position: { lat: reading.lat, lng: reading.lon },
    title: reading.device_id,
  });

  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div style="color: #333; font-size: 12px; padding: 8px;">
        <strong>${reading.device_id}</strong><br>
        ${reading.kind}<br>
        ${new Date(reading.observed_at).toLocaleString()}<br>
        <hr>
        ${Object.entries(reading.metrics)
          .map(([k, v]) => `<strong>${k}:</strong> ${v}<br>`)
          .join("")}
      </div>
    `,
  });

  marker.addListener("click", () => {
    // Close previous info windows
    infoWindow.open(ds.map, marker);
  });

  return marker;
}
```

**For Alerts:**
```javascript
function createAlertMarker(alert) {
  if (!alert.lat || !alert.lon) return null;

  const markerOptions = {
    map: ds.map,
    position: { lat: alert.lat, lng: alert.lon },
    title: alert.title,
  };

  // Customize pin color based on severity
  if (alert.severity === "error") {
    markerOptions.pinGlyph = new google.maps.marker.PinElement({
      background: "#F44336",
      glyphColor: "#fff",
    });
  } else {
    markerOptions.pinGlyph = new google.maps.marker.PinElement({
      background: "#FF9800",
      glyphColor: "#fff",
    });
  }

  const marker = new google.maps.marker.AdvancedMarkerElement(markerOptions);

  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div style="color: #333; font-size: 12px; padding: 8px;">
        <strong>${alert.title}</strong><br>
        ${alert.description}<br>
        <em>${alert.severity.toUpperCase()} | ${new Date(alert.created_at).toLocaleString()}</em>
      </div>
    `,
  });

  marker.addListener("click", () => {
    infoWindow.open(ds.map, marker);
  });

  return marker;
}
```

### Step 5: Update Map Focus Function

```javascript
window.focusAlert = (id) => {
  const alert = ds.alerts.find((a) => a.id === id);
  if (alert && alert.lat && alert.lon) {
    ds.map.setCenter({ lat: alert.lat, lng: alert.lon });
    ds.map.setZoom(14);
  }
};

window.focusSensor = (id) => {
  const sensor = ds.readings.find((r) => r.id === id);
  if (sensor) {
    ds.map.setCenter({ lat: sensor.lat, lng: sensor.lon });
    ds.map.setZoom(14);
  }
};
```

## Option 2: Google Earth Integration (Advanced)

### Using Google Earth API Plugin

```html
<script src="https://www.gstatic.com/earthengine/v20240722/earthengine-api.js"></script>
<script src="https://www.gstatic.com/earthengine/v20240722/ee.js"></script>
```

### 3D Satellite Imagery

```javascript
function initGoogleEarth() {
  const earth = new window.google.earth.EarthBuilder({
    element: document.getElementById("map"),
    center: { lat: 11.0036, lng: 76.9655 },
    zoom: 15,
  });

  earth.setImageryLayer("SATELLITE_3D");
  
  // Add custom layers
  earth.addImageryLayer(ee.ImageCollection("COPERNICUS/S2")
    .filterDate("2024-01-01", "2024-12-31")
    .filterBounds(ee.Geometry.Point([76.9655, 11.0036])));

  return earth;
}
```

## Option 3: Hybrid Approach (Recommended for Performance)

Keep Leaflet as default, add Google Maps as toggle option:

```javascript
let mapMode = "leaflet"; // or "google"

function initMap() {
  if (mapMode === "google") {
    initGoogleMap();
  } else {
    initLeafletMap();
  }
}

// Add toggle button in HTML
<button onclick="switchMapProvider()">Switch to Google Maps</button>

function switchMapProvider() {
  mapMode = mapMode === "leaflet" ? "google" : "leaflet";
  // Reinitialize map
  document.getElementById("map").innerHTML = "";
  initMap();
  updateMapMarkers();
}
```

## API Costs and Limits

### Google Maps Pricing
- **Maps JavaScript API**: $7.00 per 1,000 map loads (first 28,004 free/month)
- **Advanced Markers**: $0.56 per 1,000 markers/month
- **Geocoding API**: $0.005 per request (first 40,000 free/month)

### Free Tier
- Up to 28,004 map loads/month free
- Daily quota: 25,000 requests
- Session quota: 11,000 requests

### Optimization Tips
- Cache API responses in backend
- Batch geocoding requests
- Use tile caching
- Implement request throttling

## Environment Configuration

### .env File (Add to api-node)
```env
GOOGLE_MAPS_API_KEY=your_api_key_here
MAP_PROVIDER=leaflet # or google
DEFAULT_MAP_ZOOM=12
DEFAULT_CENTER_LAT=11.0036
DEFAULT_CENTER_LON=76.9655
```

### Update package.json
```json
{
  "dependencies": {
    "cors": "2.8.5",
    "express": "5.1.0",
    "dotenv": "^16.0.0"
  }
}
```

### Update server.js
```javascript
import dotenv from "dotenv";
dotenv.config();

app.get("/config", (req, res) => {
  res.json({
    mapProvider: process.env.MAP_PROVIDER || "leaflet",
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    defaultZoom: parseInt(process.env.DEFAULT_MAP_ZOOM || "12"),
  });
});
```

## Troubleshooting

### Issue: "Cannot read property 'map' of undefined"
**Solution**: Ensure Google Maps API is loaded before script execution
```html
<script>
  window.addEventListener("load", initMap);
</script>
```

### Issue: Markers not appearing
**Solution**: Check API key restrictions and enable required APIs

### Issue: High latency
**Solution**: 
- Use `async defer` in script tag
- Cache marker data
- Implement lazy loading for markers

### Issue: API Key exposed
**Solution**: 
- Use HTTP referrer restrictions
- Implement backend proxy for API calls
- Use OAuth for production

## Production Deployment

### For AWS Deployment
```javascript
const apiKey = await getSecretManager("google-maps-api-key");
// Use backend endpoint instead of frontend API key
```

### For Docker Deployment
```dockerfile
ENV GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}
RUN npm install
```

## Alternative Map Providers

| Provider | Free Tier | Cost | Features |
|----------|-----------|------|----------|
| OpenStreetMap + Leaflet | Yes | Free | Basic, open-source |
| Google Maps | Limited | $7/1000 | Advanced, 3D, satellite |
| Mapbox | Limited | $4/1000 | Customizable, vector |
| ArcGIS | Limited | $0.50/1000 | Enterprise GIS |
| HERE Maps | Limited | $5/1000 | Developer-friendly |

## Recommended Configuration

**For Development**: Use Leaflet + OpenStreetMap (Free)
**For Production**: Use Google Maps with backend API key proxy
**For Hybrid**: Toggle between providers for user preference

---

## References
- [Google Maps API Docs](https://developers.google.com/maps/documentation)
- [Leaflet Documentation](https://leafletjs.com/)
- [Google Earth API](https://developers.google.com/earth-engine)
- [Mapbox Documentation](https://docs.mapbox.com/)

---

**Last Updated**: May 8, 2026
**Version**: 1.0
