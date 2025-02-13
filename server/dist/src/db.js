"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('test', 'postgres', '123456@123', {
    host: 'localhost', // O la dirección de tu servidor PostgreSQL
    port: 5432, // Puerto por defecto de PostgreSQL
    dialect: 'postgres',
    logging: false, // Opcional: Desactivar logs de Sequelize
});
exports.sequelize = sequelize;
