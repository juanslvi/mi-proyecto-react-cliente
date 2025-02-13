import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000; // Usa una variable de entorno para el puerto

app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Habilita el análisis de JSON en las solicitudes

// Rutas de ejemplo
app.get('/api/hello', (req: Request, res: Response) => {
  res.send('¡Hola desde el backend!');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});  