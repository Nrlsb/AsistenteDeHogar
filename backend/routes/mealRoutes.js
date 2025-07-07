import express from 'express';
import {
  getMealPlans,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
} from '../controllers/mealPlanController.js';
import { protect } from '../middleware/authMiddleware.js'; // Updated import

const router = express.Router();

router.route('/').get(protect, getMealPlans).post(protect, createMealPlan);
router
  .route('/:id')
  .put(protect, updateMealPlan)
  .delete(protect, deleteMealPlan);

export default router;
