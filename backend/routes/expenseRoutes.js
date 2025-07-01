const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Expense = require('../models/expenseModel');

// Aplicamos el middleware a todas las rutas
router.use(authMiddleware);

// @desc    Obtener todos los gastos del usuario
// @route   GET /api/expenses
router.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).send('Error del servidor');
    }
});

// @desc    Crear un nuevo gasto
// @route   POST /api/expenses
router.post('/', async (req, res) => {
    const { description, amount } = req.body;
    if (!description || !amount) {
        return res.status(400).json({ message: 'Descripción y monto son obligatorios' });
    }
    try {
        const expense = new Expense({ description, amount: parseFloat(amount), user: req.user.id });
        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).send('Error del servidor');
    }
});

// @desc    Eliminar un gasto
// @route   DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });
        if (!expense) {
            return res.status(404).json({ message: 'Gasto no encontrado' });
        }
        await expense.deleteOne();
        res.json({ message: 'Gasto eliminado' });
    } catch (error) {
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
