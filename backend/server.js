import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// We will use the built-in express body parser, so the external 'body-parser' is not needed.
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

// --- Body Parser Middleware (Standard Express Method) ---
// This should be placed BEFORE any routes.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- NEW DEBUGGING MIDDLEWARE ---
// This will run for every request and log the body.
app.use((req, res, next) => {
  console.log('--- Request Body Logger ---');
  console.log('Request Path:', req.path);
  console.log('Request Method:', req.method);
  console.log('Request Body:', req.body);
  console.log('--------------------------');
  next(); // Move on to the next middleware/route handler
});


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
