const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Expense = require('../models/expenseModel');

// @route   GET /api/expenses
// @desc    Obtener todos los gastos
router.get('/', protect, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del Servidor');
    }
});

// @route   POST /api/expenses
// @desc    Añadir un nuevo gasto
router.post('/', protect, async (req, res) => {
    const { description, amount } = req.body;
    try {
        const newExpense = new Expense({
            user: req.user.id,
            description,
            amount
        });
        const expense = await newExpense.save();
        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del Servidor');
    }
});

// @route   DELETE /api/expenses/:id
// @desc    Eliminar un gasto
router.delete('/:id', protect, async (req, res) => {
    try {
        let expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ msg: 'Gasto no encontrado' });
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Gasto eliminado' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del Servidor');
    }
});

module.exports = router;
