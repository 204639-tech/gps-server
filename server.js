import express from 'express';
const app = express();

const PORT = process.env.PORT;

// Ruta raíz
app.get('/', (req, res) => {
  res.send('🚀 Servidor GPS en Railway funcionando correctamente');
});

// Ruta /api/gps
app.get('/api/gps', (req, res) => {
  res.json({ lat: -13.532, lng: -71.967 });
});

// Escuchar en 0.0.0.0 (¡IMPORTANTE para Railway!)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor GPS corriendo en el puerto ${PORT}`);
});