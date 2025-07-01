const mongoose = require('mongoose');

// --- Modelo de Categoría de Compras ---
const ShoppingCategorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true, trim: true }
}, { timestamps: true });

const ShoppingCategory = mongoose.model('ShoppingCategory', ShoppingCategorySchema);


// --- Modelo de Item de Compra ---
const ShoppingItemSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    // CORRECCIÓN: Se cambió "mongoose.sechma.Types.ObjectId" a "mongoose.schema.Types.ObjectId"
    category: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'ShoppingCategory' },
    name: { type: String, required: true, trim: true },
    purchased: { type: Boolean, default: false }
}, { timestamps: true });

const ShoppingItem = mongoose.model('ShoppingItem', ShoppingItemSchema);

module.exports = { ShoppingCategory, ShoppingItem };
