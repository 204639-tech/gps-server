import express from 'express';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware para procesar JSON
app.use(express.json());

// Ruta base para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.send('🚀 Servidor GPS funcionando correctamente');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
