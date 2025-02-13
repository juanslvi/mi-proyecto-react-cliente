import { DataTypes, Model } from 'sequelize';
import { sequelize } from './db'; // Importa la instancia de Sequelize

interface TaskAttributes {
    id: number;
    nombre_tarea: string;
    descripcion: string;
    estado: string;    
  }

  class Task extends Model<TaskAttributes> implements TaskAttributes{
    public id!:number;
    public nombre_tarea!:string;
    public descripcion!: string;
    public estado!: string;

    static async findByNombre(nombre_tarea: string){
        return Task.findOne({where:{nombre_tarea}});
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
            allowNull: false,
          },
          estado: {
            type: DataTypes.STRING,
            allowNull: false,
          },
    },
    {
        sequelize,
        modelName: 'Task',
        tableName: 'tasks'
    }
  );

  export default Task;