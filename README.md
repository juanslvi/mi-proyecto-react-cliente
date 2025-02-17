# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



### ---------------------------------------------------------------------------------------------- ###


### Comentarios Personales: 

El sistema fue hecho para evaluar mi desempeño de programador por medio de una sencilla pantalla CRUD en codigo utilizando React. A continuación describiré la estructura de código implementada para dicha pantalla.

Utilizaremos una Base de Datos llamada 'TEST' creada en PostgresSQL, y dentro de ella crearemos una tabla con la siguientes campos:
	-id:integer (PrymaryKey/Autoincrement/NotNull)
	-nombre_tarea:character varying(255) (NotNull)
	-descripcion:text (AllowNull)
	-estado:character varying(255) (NotNull)
	-createdAt:timestamp with time zone (NotNull)
	-updatedAt:timestamp with time zone (AllowNull)

Codigo de la creacion de la tabla:
CREATE TABLE IF NOT EXISTS public.tasks
(
    id integer NOT NULL DEFAULT nextval('tareas_id_seq'::regclass),
    nombre_tarea character varying(255) COLLATE pg_catalog."default" NOT NULL,
    descripcion text COLLATE pg_catalog."default",
    estado character varying(50) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone,
    CONSTRAINT tareas_pkey PRIMARY KEY (id),
    CONSTRAINT tareas_estado_check CHECK (estado::text = ANY (ARRAY['Pendiente'::character varying, 'En progreso'::character varying, 'Completado'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tasks
    OWNER to postgres;

-----------------------------------------------------------------------------------------------------------------------------------

El codigo completo se divide en programacion para el lado del Cliente (frontend) y para un servidor que gestionara las peticiones del cliente a traves de un API que a su ves este conectara con una base de datos hecha en PostgresSQL.

-----------------------------------------------------------------------------------------------------------------------------------
~~Cliente~~

Del lado del Cliente, solo se manejaran el componente TaskForm.tsx y TaskListForm.tsx:
-TaskList.tsx, sera instanciada en APP.tsx(Entrada principal de la aplicacion) y se encargara de crear una interfaz tipo listado para poder visualizar la informacion de una tarea (Task).
-TaskForm.tsx, se mandara llamar dentro de TaskList.tsx para poder mostrar un formulario al usuario con el cual creara o editara las tareas.

Bibliotecas usadas en los componentes.
TaskList.tsx:
	-React.
	-React Query para la gestion de datos asincronos.
	-Axios para facilitar las peticiones HTTP desde la aplicación al servidor.
	-Styled Components, biblioteca de CSS-in-JS para una intefaz sencilla.
	-React-Toastify para notificaciones emergentes y personalizables.

TaskForm.tsx
	-React.
	-React Hook Form para facilitar el uso de formularios.
	-Tanstack/react-query 
	-Axios para facilitar las peticiones HTTP desde la aplicación al servidor.
	-Styled Components, biblioteca de CSS-in-JS para una intefaz sencilla.
	-React-Toastify para notificaciones emergentes y personalizables.

Funciones/Metodos de los componentes.
TaskList.tsx:
	-interface Task: Definicion de interface para el modelo Task(Tarea)
	-interface TaskFormProps: Asignacion de propiedades al formulario
	-interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>: define las propiedades que puede recibir un componente de entrada 
	-const TaskForm: React.FC<TaskFormProps>: Define componente funcional y recibe las propiedades del modelo Task. y Recibe la función para cerrar formulario. Dentro del componente se definen otras funciones:
		-const mutation = useMutation: Este hook permite realizar mutaciones (creaciones, actualizaciones, eliminaciones) en datos asíncronos.
	-const onSubmit = async (data: Task): función asíncrona que se encarga de enviar los datos del formulario al backend.
	-Codigo formulario en react controlado por react-hook-form
	-Codigo CSS para el formulario


TaskForm.tsx
	-interface Task: Definicion de interface para el modelo Task(Tarea)
	-const TaskList: React.FC = () =>: define un componente funcional de React sin recibir ningun argumento
		- const [isCreating, setIsCreating] : Inicializa un estado con el valor false. Este estado se llamará isCreating y se utilizará para controlar si el formulario de creación de una nueva tarea está visible o no. 'False' significa que el formulario no está visible inicialmente.
  		- const [editingTask, setEditingTask] : Inicializa un estado con el valor null. Este estado se llamará editingTask y se utilizará para almacenar la tarea que se está editando actualmente.
		- const [filterName, setFilterName] : Inicializa un estado con una cadena vacía (''). Este estado se llamará filterName y se utilizará para almacenar el texto que el usuario introduce para filtrar las tareas por nombre.
		- const { isLoading, error, data: tasks, refetch } = useQuery({: Este código utiliza el hook useQuery de Tanstack React-Query para obtener y gestionar una lista de tareas desde una API.
		-const deleteTaskMutation = useMutation({:  Este codigo se usa para gestionar la eliminación de una tarea en un backend de manera asincrona.
		- const handleDelete = (task: Task) => {: Esta funcion es la que mandara llamada cada elemento del listado de tareas para poder eliminar una tarea en especifico.
		- const filteredTasks = (tasks ?? []).filter((task: Task) =>: Este código filtra un array de tareas (tasks) basándose en un texto de filtro (filterName). 
	-Codigo para mostrar el listado al usuario
	-Codigo CSS para el listado

Dependencias utilizadas del lado del cliente:

Dependencias:
-@types/express: "^5.0.0"
-@types/pg: "^8.11.11"
-@types/sequelize: "^4.28.20"
-cors: "^2.8.5"
-express: "^4.21.2"
-pg: "^8.13.3"
-pg-hstore: "^2.3.4"
-sequelize: "^6.37.5"

Dependencias de desarrollo (devDependencies):
-@types/cors: "^2.8.17"
-@types/node: "^22.13.1"
-nodemon: "^3.1.9"
-ts-node: "^10.9.2"
-typescript: "^5.7.3"

-----------------------------------------------------------------------------------------------------------------------------------
~~Server~~
*Nota: Del lado del servidor tuve varios tropiezos con las implementaciones de las versiones con TypeScript y React y algunas dependencias, esto origino que creara algunas estructuras de carpetas o archivos poco viables.

En el servidor se manejo para la creacion de un API de la informacion de las tareas, a continuacio describire la estructura que se utilizo para dicho fin.

Dentro de la carpeta /server/src/ se enceuntra el archivo de configuracion para la conexion a la base de datos: 'db.ts'.
Este archivo consta de la siguiente informacion (Nota* se que debe tener un archivo de configuracion para no mostrar los valores de conexion en el codigo. Se debe usar variables.):
	-Utiliza ORM Sequelize para la conexion
	-Host, Port, Dialect y  Loggin

Dentro de la carpeta /server/src/models/ se define el modelo de 'task.ts'(tareas): Este modelo define la estructura de los datos que representan una tarea en la aplicación. Se utilizará en el lado del servidor para interactuar con la base de datos y enviar la información al cliente.

task.ts
Dentro de task definirmos 2 tipo de intefaces: 
//Creacion
-interface TaskCreationAttributes {
  nombre_tarea: string;
  descripcion: string;
  estado: string;
}

//Edicion
-interface TaskAttributes {
    id: number;
    nombre_tarea: string;
    descripcion: string;
    estado: string;
}

-class Task extends Model<TaskAttributes, TaskCreationAttributes>: Indica que la clase Task hereda de la clase Model de Sequelize. Esto significa que tendrá acceso a las funcionalidades que Sequelize proporciona para interactuar con la base de datos.
	-Task.init(: Configura el modelo Task para que corresponda a la tabla tasks en la base de datos. 


Dentro de la carpeta /server/src/routes/ se define el modelo de 'taskRoutes.ts', este archivo contiene la definición de las rutas (endpoints) de un API relacionadas con la gestión de tareas. Utiliza el framework Express.

Funciones/Metodos de taskRoutes.ts
-const router = express.Router(); crea un nuevo objeto enrutador.  Este enrutador permite definir y gestionar rutas de manera modular y organizada.

-Se definen las rutas del API. 
	-router.get('/tasks', async (req: Request, res: Response) => {: Esta ruta de tipo GET se encarga de obtener una lista de tareas desde la base de datos y enviarla como respuesta en formato JSON. 

	-router.get('/tasks/:id', async (req: Request, res: Response) => {: Esta ruta de tipo GET se encarga de obtener una tarea específica de la base de datos, buscándola por su ID, y enviarla como respuesta en formato JSON.

	-router.post('/tasks', async (req: Request, res: Response) => {: Esta ruta de tipo POST se encarga de crear una nueva tarea en la base de datos y enviar la tarea creada como respuesta en formato JSON.

	-router.delete('/tasks/:id', async (req: Request, res: Response) => {: Esta ruta de tipo DELETE se encarga de eliminar una tarea específica de la base de datos, buscándola por su ID. Luego, envía una respuesta indicando que la eliminación fue exitosa (o un error si no se encontró la tarea o hubo un problema en el proceso).

	-router.put('/tasks/:id', async (req: Request, res: Response) => {: Esta ruta de tipo PUT se encarga de actualizar una tarea específica en la base de datos, buscándola por su ID. Luego, envía la tarea actualizada como respuesta en formato JSON.


**IMPORTANTE**
Dentro de la carpeta /server/ se encuentra el archivo 'index.ts', este archivo es llamado al principio solo si se ejecuta el servidor en modo dev con la instruccion 'npm run dev'. Este paso esta definido en el archivo de configuracion: 'server/tsconfig.json': 

[linea:17]   
"include": [
    "src/**/*.ts",
    "index.ts"
  ],

Dentro de la carpeta /server/ se en cuentra el archivo principal 'app.ts', este archivo configura una aplicación Express para construir el API solicitado.
	-import express, { Request, Response } from 'express';: Esta es la forma recomendada de importar Express en TypeScript, ya que proporciona tipado estricto para las solicitudes y respuestas, lo que ayuda a prevenir errores.

	-Importa el enrutador taskRoutes desde el archivo ./routes/taskRoutes.ts. Este archivo contiene la definición de las rutas (endpoints) relacionadas con las tareas.

	-import cors from 'cors';: Importa el middleware cors desde el paquete cors. El mecanismo de seguridad del navegador que restringe las solicitudes HTTP desde un origen diferente al del servidor.

	-app.use(express.json());: Habilita el análisis de solicitudes JSON. 

	-app.use(cors());: Habilita CORS para todas las rutas.  Sin configuración adicional, permitirá solicitudes desde cualquier origen. 

	-app.use('/api', taskRoutes);: Monta el enrutador taskRoutes en la ruta /api.  Esto significa que todas las rutas definidas en taskRoutes estarán disponibles bajo el prefijo /api.

	-export default app;: Exporta la instancia de la aplicación Express (app).  Esto permite que otros módulos (como el archivo principal de la aplicación 'index.ts') puedan importar y utilizar esta instancia para iniciar el servidor.


Dependencias utilizadas en Server:

Dependencias (dependencies):
@types/express: ^5.0.0
@types/pg: ^8.11.11
@types/sequelize: ^4.28.20
cors: ^2.8.5
express: ^4.21.2
pg: ^8.13.3
pg-hstore: ^2.3.4
sequelize: ^6.37.5

Dependencias de Desarrollo (devDependencies):
@types/cors: ^2.8.17
@types/node: ^22.13.1
nodemon: ^3.1.9
ts-node: ^10.9.2
typescript: ^5.7.3

-----------------------------------------------------------------------------------------------------------------------------------
**Para hacerlo funcionar**

1. Clonar el Repositorio
La persona deberá clonar el repositorio Git en su máquina local. 
Esto se puede hacer utilizando el comando: git clone https://github.com/juanslvi/mi-proyecto-react-cliente
Y usa la rama Server: git checkout server. La Rama 'server' en mi-proyecto-react-cliente contiene todo el proyecto.

Nota:(Se que se pidio que estuviera dividido en 2 carpetas/repositorios una para Cliente y otra para Server), se hizo asi en un principio, pero tuve conflictos con el visualStudio y los repositorios y ramas se empezaron a empalmar y decidi solo usar el reporsitorio del 'cliente'.

2. Configurar la Base de Datos (si aplica)
La persona deberá configurarla en su máquina local. Esto puede implicar la instalación del software de la base 
de datos (PostgreSQL) y la creación de la base de datos y las tablas necesarias. Se anexara el Backup de la base de datos en el cuerpo del correo.

3. Instalar las Dependencias
Tanto en la carpeta del cliente (React) como en la del servidor (Node.js), la persona deberá instalar las 
dependencias del proyecto. Esto se hace generalmente con el comando npm install.

4. Iniciar el Servidor (Backend)
La persona deberá iniciar el servidor Node.js. Esto se hace generalmente con el comando npm start, pero usaremos el comando 'npm run dev' ya que en desarrollo apunta al index.ts para obtener las APIS programadas.

5. Iniciar la Aplicación Cliente (Frontend)
La persona deberá iniciar la aplicación React. Esto se hace generalmente con el comando 'npm start'.

6. Ajustar las Rutas de la API (si es necesario) 
Si la URL de la API del servidor no es la predeterminada (http://localhost:5000), la persona deberá ajustar la configuración en la aplicación React para que coincida con la URL correcta.
en el archivo de configuracion: mi-proyecto-react/server/index.ts en la linea 4:
const PORT = process.env.PORT || 5000;

7. Ejecutar la Aplicación
Una vez que se han completado todos los pasos anteriores, la persona debería poder ejecutar 
la aplicación React en su navegador y esta debería comunicarse correctamente con el servidor Node.js.