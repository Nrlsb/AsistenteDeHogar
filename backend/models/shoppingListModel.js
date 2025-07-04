// backend/models/shoppingListModel.js
const mongoose = require('mongoose');
const { shoppingItemSchema } = require('./shoppingItemModel');

const shoppingListSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Por favor, añade un nombre para la lista de compras'],
    },
    items: [shoppingItemSchema], // Array de artículos de compra anidados
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ShoppingList', shoppingListSchema);
