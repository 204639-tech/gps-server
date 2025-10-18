import express from 'express';

const app = express();
const PORT = process.env.PORT || 8080;

// Para JSON si luego enviamos POST
app.use(express.json());

// Memoria simple para guardar la última coordenada recibida
let lastCoord = null;

// ✅ Ruta base: prueba de vida
app.get('/', (req, res) => {
  res.send('🚀 Servidor GPS funcionando correctamente');
});

// ✅ Ruta receptora de coordenadas
// Acepta:
//   GET  /gps?lat=-13.5&lon=-71.9
//   GET  /gps?lat=-13.5&lng=-71.9
//   POST /gps  { "lat": -13.5, "lon": -71.9 }
app.all('/gps', (req, res) => {
  const q = req.method === 'GET' ? req.query : req.body;

  const latRaw = q.lat ?? q.latitude;
  const lonRaw = q.lon ?? q.lng ?? q.longitude;

  const lat = parseFloat(latRaw);
  const lon = parseFloat(lonRaw);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return res.status(400).json({
      ok: false,
      error: 'Parámetros inválidos. Usa lat y lon (o lng). Ej: /gps?lat=-13.5&lon=-71.9'
    });
  }

  lastCoord = {
    lat,
    lon,
    receivedAt: new Date().toISOString(),
    fromIP: req.headers['x-forwarded-for'] || req.socket.remoteAddress || null,
    via: req.method
  };

  console.log(`📡 Coordenadas recibidas -> lat=${lat}, lon=${lon} (${lastCoord.via})`);

  return res.json({ ok: true, saved: lastCoord });
});

// ✅ Ruta para consultar la última coordenada registrada
app.get('/last', (req, res) => {
  if (!lastCoord) {
    return res.json({ ok: true, last: null, note: 'Aún no se ha recibido ninguna coordenada.' });
  }
  return res.json({ ok: true, last: lastCoord });
});

// ✅ Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
