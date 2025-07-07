import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import shoppingRoutes from './routes/shoppingRoutes.js';
import mealRoutes from './routes/mealRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';

dotenv.config();
connectDB();

const app = express();

// CORS configuration to allow requests from your Netlify frontend
const allowedOrigins = [
  'http://localhost:3000', // For local development
  'https://asistentedehogar.onrender.com', // Your backend URL
  'https://asistente-de-hogar.netlify.app', // Your frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use(express.json()); // Middleware to parse JSON bodies

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/shopping', shoppingRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/expenses', expenseRoutes);

// A simple root endpoint to confirm the API is running
app.get('/', (req, res) => {
  res.send('AsistenteDeHogar API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
