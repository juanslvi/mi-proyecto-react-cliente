import express, { Request, Response } from 'express';
import Task from '../models/task';

const router = express.Router();

// Ruta para obtener todas las tareas
router.get('/tasks', async (req: Request, res: Response) => {
    try {
        const tasks = await Task.findAll({
            order: [
                ['id', 'DESC'] // Ordena por el campo 'id' de forma descendente (mayor a menor)
            ]
        });
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
});

// Ruta para obtener todas las tareas por ID
router.get('/tasks/:id', async (req: Request, res: Response) => {
    try {
        const taskId = req.params.id;

        // Validar que el ID sea un número (o el tipo de dato que corresponda a tu ID)
        if (isNaN(Number(taskId))) {  // Si tu ID es UUID, usa una validación de UUID
            res.status(400).json({ error: 'Error al obtener la tarea' });
        }
        else{
            const task = await Task.findByPk(taskId); // Método más eficiente para buscar por ID
        
            if(task){
                res.json(task);                
            }
            else{
                res.status(400).json({ error: 'Tarea no encontrada' });
            }    
        }            
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la tarea' });
    }
});

// Crear una nueva tarea
router.post('/tasks', async (req: Request, res: Response) => {
    try {
        const { nombre_tarea, descripcion, estado } = req.body; // Ajusta los campos según tu modelo

        if (!nombre_tarea || !estado) { // Validación básica
            res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        else{
            const newTask = await Task.create({ nombre_tarea, descripcion, estado });    
            res.status(201).json(newTask); // 201 Created es el código de respuesta adecuado
        }        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la tarea' });
    }
});

// Ruta para eliminar una tarea por ID
router.delete('/tasks/:id', async (req: Request, res: Response) => {
    try {
        const taskId = req.params.id;

        // Validar que el ID sea un número (o el tipo de dato que corresponda a tu ID)
        if (isNaN(Number(taskId))) {
            res.status(400).json({ error: 'ID inválido' });
        }
        else{
            const task = await Task.findByPk(taskId);

            if(task){
                await task.destroy(); // Elimina la tarea de la base de datos
                res.status(204).end(); // 204 No Content es la respuesta adecuada para una eliminación exitosa
            }
            else{
                res.status(404).json({ error: 'Tarea no encontrada' });
            }
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
});

// Ruta para actualizar una tarea por ID
router.put('/tasks/:id', async (req: Request, res: Response) => {
    try {
        const taskId = req.params.id;
        const { nombre_tarea, descripcion, estado } = req.body; // Obtén los campos a actualizar

        // Validar que el ID sea un número (o el tipo de dato que corresponda a tu ID)
        if (isNaN(Number(taskId))) {
            res.status(400).json({ error: 'ID inválido' });
        }
        else{
            const task = await Task.findByPk(taskId);

            if (!task) {
                res.status(404).json({ error: 'Tarea no encontrada' });
            }
            else{
                // Actualiza los campos que se proporcionan en el body
                if (nombre_tarea) {
                    task.nombre_tarea = nombre_tarea;
                }
                if (descripcion) {
                    task.descripcion = descripcion;
                }
                if (estado) {
                    task.estado = estado;
                }
    
                await task.save(); // Guarda los cambios en la base de datos
    
                res.json(task); // Devuelve la tarea actualizada    
            }
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
});


export default router;