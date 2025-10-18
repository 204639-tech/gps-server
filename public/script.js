// Si sirves desde el mismo servidor, usa ruta relativa:
const API_BASE = ''; // mismo dominio (Railway o local)
const LAST_URL = `${API_BASE}/last`;

let map, marker, pathLine;
let pathCoords = [];
let firstFix = true;

function initMap(lat, lon) {
  const center = [lat, lon];
  map = L.map('map').setView(center, 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  marker = L.marker(center).addTo(map).bindPopup('Posición inicial');
  pathLine = L.polyline([center]).addTo(map);
}

async function fetchLast() {
  try {
    const res = await fetch(`${LAST_URL}?nocache=${Date.now()}`);
    const data = await res.json();

    if (!data.ok || !data.last) return;

    const { lat, lon, receivedAt } = data.last;
    const latlng = [lat, lon];

    if (!map) {
      initMap(lat, lon);
    }

    // Actualiza marcador y trazo
    marker.setLatLng(latlng).setPopupContent(`Lat: ${lat}<br>Lon: ${lon}<br>${new Date(receivedAt).toLocaleString()}`);
    pathCoords.push(latlng);
    pathLine.setLatLngs(pathCoords);

    if (firstFix) {
      map.flyTo(latlng, 16);
      firstFix = false;
    }
  } catch (e) {
    console.error('Error al obtener /last:', e);
  }
}

// Actualiza cada 3 segundos
setInterval(fetchLast, 3000);
fetchLast();
