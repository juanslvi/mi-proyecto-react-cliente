"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000; // Usa una variable de entorno para el puerto
app.use((0, cors_1.default)()); // Habilita CORS para todas las rutas
app.use(express_1.default.json()); // Habilita el análisis de JSON en las solicitudes
// Rutas de ejemplo
app.get('/api/hello', (req, res) => {
    res.send('¡Hola desde el backend!');
});
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
