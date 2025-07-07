// nrlsb/asistentedehogar/AsistenteDeHogar-ab8ced350d0a76f79702cd5ab21b0004078dffb3/backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const shoppingRoutes = require('./routes/shoppingRoutes');
const mealRoutes = require('./routes/mealRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Rutas de la API
app.use('/api/tasks', taskRoutes);
app.use('/api/shopping', shoppingRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    // --- CAMBIO DE VERIFICACIÓN ---
    // Este mensaje nos confirmará en los logs de Render que la nueva versión se ha desplegado.
    console.log(`>>>>>> ¡NUEVA VERSIÓN DESPLEGADA CORRECTAMENTE! <<<<<< Servidor corriendo en el puerto ${PORT}`);
});
