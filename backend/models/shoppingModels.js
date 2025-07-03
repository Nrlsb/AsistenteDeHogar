const mongoose = require('mongoose');

const shoppingCategorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    }
});

const shoppingItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    purchased: {
        type: Boolean,
        default: false
    },
    // Corregido: Se elimina 'required: true' para hacer la categoría opcional por ahora.
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShoppingCategory'
    }
}, {
    timestamps: true
});

const ShoppingCategory = mongoose.model('ShoppingCategory', shoppingCategorySchema);
const ShoppingItem = mongoose.model('ShoppingItem', shoppingItemSchema);

module.exports = { ShoppingItem, ShoppingCategory };
