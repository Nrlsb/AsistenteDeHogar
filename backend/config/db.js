const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Nos conectamos a la base de datos sin las opciones obsoletas.
        // Mongoose 8+ las maneja automáticamente.
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error de Conexión a la Base de Datos: ${error.message}`);
        // Si la conexión falla, detiene el proceso del servidor
        process.exit(1);
    }
};

module.exports = connectDB;
