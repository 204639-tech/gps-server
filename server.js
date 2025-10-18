import express from "express";
const app = express();

const PORT = process.env.PORT || 8080;

// Middleware para parsear JSON (por si el GPS envía POST)
app.use(express.json());

// 👉 Ruta para recibir coordenadas
app.get("/gps", (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).send("Faltan coordenadas (lat, lon)");
  }

  console.log(`📡 Coordenadas recibidas: Lat=${lat}, Lon=${lon}`);
  res.send(`Coordenadas recibidas correctamente: Lat=${lat}, Lon=${lon}`);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
