const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Expense = require('../models/expenseModel');
const { protect } = require('../middleware/authMiddleware');

// @desc    Obtener todos los gastos del usuario
// @route   GET /api/expenses
// @access  Private
const getExpenses = asyncHandler(async (req, res) => {
    const expenses = await Expense.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(expenses);
});

// @desc    Añadir un nuevo gasto
// @route   POST /api/expenses
// @access  Private
const addExpense = asyncHandler(async (req, res) => {
    // Extraemos la categoría del cuerpo de la petición
    const { description, amount, category } = req.body;

    if (!description || !amount || !category) {
        res.status(400);
        throw new Error('Por favor, complete todos los campos, incluyendo la categoría');
    }

    const expense = await Expense.create({
        user: req.user.id,
        description,
        amount,
        category // Guardamos la categoría
    });

    res.status(201).json(expense);
});

// @desc    Eliminar un gasto
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
        res.status(404);
        throw new Error('Gasto no encontrado');
    }

    // Asegurarse de que el gasto pertenece al usuario
    if (expense.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('No autorizado');
    }

    await expense.deleteOne();

    res.json({ id: req.params.id });
});


router.route('/').get(protect, getExpenses).post(protect, addExpense);
router.route('/:id').delete(protect, deleteExpense);

module.exports = router;
