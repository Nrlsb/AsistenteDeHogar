const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
