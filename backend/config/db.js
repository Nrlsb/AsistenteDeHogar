// CORRECCIÓN: Se usa import en lugar de require
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Nota: Las opciones 'useUnifiedTopology' y 'useNewUrlParser' ya no son necesarias en versiones recientes de Mongoose.
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error de conexión a la base de datos: ${error.message}`);
        process.exit(1);
    }
};

// CORRECCIÓN: Se usa export default en lugar de module.exports
export default connectDB;
