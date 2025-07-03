const express = require('express');
const cors = require('cors');
const path = require('path');
// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

// Importa la función de conexión a la base de datos
const connectDB = require('./config/db');

// Llama a la función para conectar a la base de datos
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/shopping', require('./routes/shoppingRoutes'));
app.use('/api/meals', require('./routes/mealRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
