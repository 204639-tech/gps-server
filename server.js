const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Memoria simple (última coord)
let lastCoord = null;

// Servir la carpeta public (frontend)
app.use(express.static('public'));

// Ruta para recibir coords (GET o POST)
app.all('/gps', (req, res) => {
  const lat = parseFloat(req.query.lat ?? req.body?.lat);
  const lon = parseFloat(req.query.lon ?? req.body?.lon);

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return res.status(400).json({ ok: false, error: 'lat/lon inválidos' });
  }

  lastCoord = {
    lat,
    lon,
    receivedAt: new Date().toISOString(),
    fromIP: req.headers['x-forwarded-for'] || req.socket.remoteAddress || null,
    via: req.method
  };

  console.log(`📍 coordenadas -> lat=${lat}, lon=${lon} (${lastCoord.via})`);
  return res.json({ ok: true, saved: lastCoord });
});

// Ruta para consultar la última coordenada registrada
app.get('/last', (req, res) => {
  if (!lastCoord) {
    return res.json({ ok: true, last: null, note: 'Aún no se ha recibido ninguna coordenada.' });
  }
  return res.json({ ok: true, last: lastCoord });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
