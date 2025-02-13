import express from 'express';
import taskRoutes from './taskRoutes';
import cors from 'cors'; // Importa cors

const app = express();

app.use(cors()); // Usa cors para permitir solicitudes desde el frontend
app.use(express.json());
app.use('/api/tasks', taskRoutes);

export default app;