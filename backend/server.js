const express = require('express');
const cors = require('cors');
const path = require('path');
// Importamos y configuramos dotenv al principio de todo
require('dotenv').config();

// Ahora podemos usar las variables de entorno
const connectDB = require('./config/db'); // Asumo que este archivo usa process.env.MONGO_URI

const app = express();

// Conectar a la base de datos
connectDB();

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
