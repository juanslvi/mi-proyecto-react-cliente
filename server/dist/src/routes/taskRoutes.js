"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_1 = __importDefault(require("../models/task"));
const router = express_1.default.Router();
// Ruta para obtener todas las tareas
router.get('/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield task_1.default.findAll();
        res.json(tasks);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
}));
// Ruta para obtener todas las tareas
router.get('/tasks/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.params.id;
        // Validar que el ID sea un número (o el tipo de dato que corresponda a tu ID)
        if (isNaN(Number(taskId))) { // Si tu ID es UUID, usa una validación de UUID
            res.status(400).json({ error: 'Error al obtener la tarea' });
        }
        const task = yield task_1.default.findByPk(taskId); // Método más eficiente para buscar por ID
        if (!task) {
            res.status(400).json({ error: 'Tarea no encontrada' });
        }
        res.json(task);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la tarea' });
    }
}));
exports.default = router;
