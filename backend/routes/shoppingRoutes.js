// CORRECCIÓN: Se usa import en lugar de require
import express from 'express';
import ShoppingItem from '../models/shoppingModels.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all shopping items
router.get('/', protect, async (req, res) => {
    const items = await ShoppingItem.find({ user: req.user.id });
    res.json(items);
});

// Add a shopping item
router.post('/', protect, async (req, res) => {
    const { name, category } = req.body;
    const item = new ShoppingItem({ name, category, user: req.user.id });
    const createdItem = await item.save();
    res.status(201).json(createdItem);
});

// Update a shopping item
router.put('/:id', protect, async (req, res) => {
    const item = await ShoppingItem.findById(req.params.id);
    if (item && item.user.toString() === req.user.id) {
        item.name = req.body.name || item.name;
        item.completed = req.body.completed !== undefined ? req.body.completed : item.completed;
        const updatedItem = await item.save();
        res.json(updatedItem);
    } else {
        res.status(404).json({ message: 'Artículo no encontrado o no autorizado' });
    }
});

// Delete a shopping item
router.delete('/:id', protect, async (req, res) => {
    const item = await ShoppingItem.findById(req.params.id);
    if (item && item.user.toString() === req.user.id) {
        await ShoppingItem.deleteOne({ _id: req.params.id });
        res.json({ message: 'Artículo eliminado' });
    } else {
        res.status(404).json({ message: 'Artículo no encontrado o no autorizado' });
    }
});

// CORRECCIÓN: Se usa export default
export default router;
