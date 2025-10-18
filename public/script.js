// Dirección base (Railway usa el mismo dominio)
const API_BASE = '';
const LAST_URL = `${API_BASE}/last`;

let map, marker, pathLine;
let pathCoords = [];
let firstFix = true;

function initMap(lat, lon) {
  const center = [lat, lon];
  map = L.map('map').setView(center, 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  marker = L.marker(center).addTo(map).bindPopup('Iniciando seguimiento...');
  pathLine = L.polyline([center], { color: 'blue', weight: 4 }).addTo(map);
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
      console.log('🗺️ Mapa inicializado');
      return;
    }

    // Actualiza posición solo si cambió
    const currentPos = marker.getLatLng();
    if (currentPos.lat !== lat || currentPos.lng !== lon) {
      marker.setLatLng(latlng)
        .setPopupContent(`Lat: ${lat}<br>Lon: ${lon}<br>${new Date(receivedAt).toLocaleTimeString()}`);
      pathCoords.push(latlng);
      pathLine.setLatLngs(pathCoords);

      console.log(`📍 Nueva coordenada -> lat=${lat}, lon=${lon}`);
      if (firstFix) {
        map.flyTo(latlng, 16);
        firstFix = false;
      }
    }
  } catch (e) {
    console.error('Error obteniendo /last:', e);
  }
}

// Consulta cada 3 segundos
setInterval(fetchLast, 3000);
fetchLast();
