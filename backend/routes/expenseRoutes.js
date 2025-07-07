import express from 'express';
import {
  getExpenses,
  createExpense,
  deleteExpense,
} from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js'; // Updated import

const router = express.Router();

router.route('/').get(protect, getExpenses).post(protect, createExpense);
router.route('/:id').delete(protect, deleteExpense);

export default router;
