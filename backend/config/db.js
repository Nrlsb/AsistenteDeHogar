const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Intenta conectarse a la base de datos usando la variable de entorno MONGO_URI
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Opciones para evitar advertencias de deprecación en la consola
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Si la conexión falla, detiene el proceso del servidor
        process.exit(1);
    }
};

module.exports = connectDB;
