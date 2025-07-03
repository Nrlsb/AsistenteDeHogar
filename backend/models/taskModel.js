const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    description: {
        type: String,
        required: [true, 'Por favor, añade una descripción']
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    // Nuevo campo para la fecha de vencimiento
    dueDate: {
        type: Date,
        required: false // Es opcional
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
