import express from 'express';
import taskRoutes from './routes/taskRoutes';
import cors from 'cors'; // Importa cors

const app = express();

app.use(cors()); // Usa cors para permitir solicitudes desde el frontend
app.use(express.json());
//app.use('/api/tasks', taskRoutes);
app.use('/api', taskRoutes);

app.get('/test', (req, res) => {
    res.send('Test route works!');
});

export default app;