import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser'; // Import body-parser
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import shoppingRoutes from './routes/shoppingRoutes.js';
import mealRoutes from './routes/mealRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';

dotenv.config();
connectDB();

const app = express();

// --- CORS Configuration ---
const allowedOrigins = [
  'http://localhost:3000',
  'https://asistentedehogar.onrender.com',
  'https://asistente-hogar.netlify.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('--asistente-hogar.netlify.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

// --- Body Parser Middleware ---
// Use body-parser to correctly parse JSON request bodies.
// This replaces the old app.use(express.json()).
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/shopping', shoppingRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/expenses', expenseRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('AsistenteDeHogar API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
