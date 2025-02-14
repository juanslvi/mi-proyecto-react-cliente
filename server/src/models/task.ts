import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';

interface TaskAttributes {
    id: number;
    nombre_tarea: string;
    descripcion: string;
    estado: string;
}

//interface para crear tareas sin el campo ID autoincremento
interface TaskCreationAttributes {
  nombre_tarea: string;
  descripcion: string;
  estado: string;
}

class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
    public id!: number;
    public nombre_tarea!: string;
    public descripcion!: string;
    public estado!: string;

    static async findByNombre(nombre_tarea: string): Promise<Task | null> { // Tipo de retorno más específico
        return Task.findOne({ where: { nombre_tarea } });
    }
}

  Task.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          nombre_tarea: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          descripcion: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          estado: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Pendiente', // Valor por defecto
          },
    },
    {
        sequelize,
        modelName: 'Task',
        tableName: 'tasks'
    }
  );

  export default Task;