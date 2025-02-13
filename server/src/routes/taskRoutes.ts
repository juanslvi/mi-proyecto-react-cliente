import express, { Request, Response } from 'express';
import Task from '../models/task';

const router = express.Router();

// Ruta para obtener todas las tareas
router.get('/tasks', async (req: Request, res: Response) => {
    try {
        const tasks = await Task.findAll();
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
});

// Ruta para obtener todas las tareas
router.get('/tasks/:id', async (req: Request, res: Response) => {
    try {
        const taskId = req.params.id;

        // Validar que el ID sea un número (o el tipo de dato que corresponda a tu ID)
        if (isNaN(Number(taskId))) {  // Si tu ID es UUID, usa una validación de UUID
            res.status(400).json({ error: 'Error al obtener la tarea' });
        }

        const task = await Task.findByPk(taskId); // Método más eficiente para buscar por ID
        
        if(!task){
            res.status(400).json({ error: 'Tarea no encontrada' });
        }

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la tarea' });
    }
});

export default router;