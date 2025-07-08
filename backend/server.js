// Importaciones necesarias
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const serverless = require('serverless-http'); // Importamos serverless-http
const connectDB = require('./config/db');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas de la API
// Se elimina el prefijo "/api" porque Netlify lo gestionará con la redirección.
// Por ejemplo, una llamada a /api/auth/login será redirigida a la función,
// y Express la verá como /auth/login.
app.use('/auth', require('./routes/authRoutes'));
app.use('/tasks', require('./routes/taskRoutes'));
app.use('/shopping', require('./routes/shoppingRoutes'));
app.use('/meals', require('./routes/mealRoutes'));
app.use('/expenses', require('./routes/expenseRoutes'));

// Se elimina la parte de servir archivos estáticos y app.listen,
// ya que Netlify se encarga de servir el frontend y de ejecutar el backend.

// Exportamos la app de Express envuelta por serverless-http para que sea compatible con Netlify Functions
module.exports.handler = serverless(app);
