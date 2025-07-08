// Importaciones necesarias
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos MongoDB
connectDB();

const app = express();

// Middleware
// Habilitar CORS para todas las rutas. En un entorno de producción,
// es una buena práctica restringir esto a la URL de tu frontend.
// Ejemplo: app.use(cors({ origin: 'https://tu-frontend.onrender.com' }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas de la API
// Se mantiene el prefijo /api para que las rutas sean consistentes
// y fáciles de consumir desde el frontend.
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/shopping', require('./routes/shoppingRoutes'));
app.use('/api/meals', require('./routes/mealRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));

// Definir el puerto. Render establece la variable de entorno PORT automáticamente.
const PORT = process.env.PORT || 5000;

// Iniciar el servidor para que Render pueda ejecutarlo
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// ---
// Nota importante: Se ha eliminado la parte de código que servía los archivos estáticos del frontend.
// La práctica recomendada en plataformas como Render es desplegar el frontend como un "Static Site"
// y el backend como un "Web Service" por separado. Esto hace que la aplicación sea más robusta y escalable.
// ---
