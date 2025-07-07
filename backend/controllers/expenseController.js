import Expense from '../models/expenseModel.js';

// @desc    Get expenses for the logged-in user
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res) => {
  const { description, amount, category } = req.body;
  if (!description || !amount || !category) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  try {
    const expense = await Expense.create({
      description,
      amount,
      category,
      user: req.user.id,
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    await expense.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getExpenses, createExpense, deleteExpense };
