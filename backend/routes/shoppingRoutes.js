import express from 'express';
import {
  getShoppingItems,
  createShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
} from '../controllers/shoppingController.js';
import { protect } from '../middleware/authMiddleware.js'; // Updated import

const router = express.Router();

router
  .route('/')
  .get(protect, getShoppingItems)
  .post(protect, createShoppingItem);
router
  .route('/:id')
  .put(protect, updateShoppingItem)
  .delete(protect, deleteShoppingItem);

export default router;
