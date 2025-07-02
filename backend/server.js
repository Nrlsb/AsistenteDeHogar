// 1. IMPORTACIONES
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// IMPORTAR RUTAS
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const shoppingRoutes = require('./routes/shoppingRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const mealRoutes = require('./routes/mealRoutes');

// 2. CONFIGURACIÓN INICIAL
const app = express();
const PORT = process.env.PORT || 5000;

// 3. MIDDLEWARE GLOBAL

// --- INICIO DE LA CORRECCIÓN DE CORS ---
const corsOptions = {
  origin: process.env.FRONTEND_URL, // Permite solo peticiones desde la URL del frontend
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));
// --- FIN DE LA CORRECCIÓN DE CORS ---

app.use(express.json());

// 4. CONEXIÓN A LA BASE DE DATOS
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

// 5. RUTAS DE LA API
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/shopping', shoppingRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/meals', mealRoutes);


// 6. INICIAR EL SERVIDOR
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
