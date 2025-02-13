import express from 'express';
import Task from '../models/task';

const router  = express.Router();

//Ruta para obtener todas las tareas
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
});

export default router;