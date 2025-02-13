"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const cors_1 = __importDefault(require("cors")); // Importa cors
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); // Usa cors para permitir solicitudes desde el frontend
app.use(express_1.default.json());
app.use('/api/tasks', taskRoutes_1.default);
exports.default = app;
