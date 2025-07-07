// CORRECCIÓN: Se usa import en lugar de require
import express from 'express';
import Expense from '../models/expenseModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Obtener todos los gastos de un usuario
// @route   GET /api/expenses
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los gastos' });
    }
});

// @desc    Crear un nuevo gasto
// @route   POST /api/expenses
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { description, amount, category } = req.body;
        if (!description || !amount || !category) {
            return res.status(400).json({ message: 'Por favor, complete todos los campos' });
        }
        const expense = new Expense({
            description,
            amount,
            category,
            user: req.user.id,
        });
        const createdExpense = await expense.save();
        res.status(201).json(createdExpense);
    } catch (error) {
        res.status(400).json({ message: 'Datos de gasto inválidos' });
    }
});

// @desc    Eliminar un gasto
// @route   DELETE /api/expenses/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (expense && expense.user.toString() === req.user.id) {
            await Expense.deleteOne({ _id: req.params.id });
            res.json({ message: 'Gasto eliminado' });
        } else {
            res.status(404).json({ message: 'Gasto no encontrado o no autorizado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el gasto' });
    }
});

// CORRECCIÓN: Se usa export default en lugar de module.exports
export default router;
