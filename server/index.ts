import app from './src/app';
import { sequelize } from './src/db';

const PORT = process.env.PORT || 5000;
//const PORT = process.env.PORT || 3001;

sequelize.sync().then(() => { // Sincroniza la base de datos antes de iniciar el servidor
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}).catch(err => {
    console.error("Error syncing database:", err);
});