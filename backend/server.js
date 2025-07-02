const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const shoppingRoutes = require('./routes/shoppingRoutes');
const mealRoutes = require('./routes/mealRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- NUEVA RUTA DE HEALTH CHECK ---
// Puedes visitar la URL de tu backend (ej: https://asistentedehogar-backend.onrender.com)
// para verificar que el servidor está corriendo y para "despertarlo".
app.get('/', (req, res) => {
    res.send('Asistente de Hogar API is running!');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/shopping', shoppingRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/expenses', expenseRoutes);


const PORT = process.env.PORT || 5000;

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
    console.error('MongoDB connection error:', err)
    // Si la conexión falla, el proceso se detendrá.
    // Esto hará que Render muestre un error en los logs.
    process.exit(1);
});
