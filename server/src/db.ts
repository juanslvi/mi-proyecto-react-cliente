import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('test', 'postgres', '123456@123', {
  host: 'localhost', // O la dirección de tu servidor PostgreSQL
  port: 5432, // Puerto por defecto de PostgreSQL
  dialect: 'postgres',
  logging: false, // Opcional: Desactivar logs de Sequelize
});

export { sequelize };