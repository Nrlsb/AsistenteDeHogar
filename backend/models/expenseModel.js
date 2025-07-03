const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    description: {
        type: String,
        required: [true, 'Por favor, añade una descripción']
    },
    amount: {
        type: Number,
        required: [true, 'Por favor, añade un monto']
    },
    // Nuevo campo para la categoría del gasto
    category: {
        type: String,
        required: [true, 'Por favor, añade una categoría'],
        default: 'Varios' // Asignamos un valor por defecto
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);
