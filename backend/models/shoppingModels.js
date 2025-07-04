// backend/models/shoppingItemModel.js
const mongoose = require('mongoose');

const shoppingItemSchema = mongoose.Schema(
  {
    // Ya no necesita una referencia de 'user' aquí, porque estará anidado en una ShoppingList que tiene un propietario.
    text: {
      type: String,
      required: [true, 'Por favor, añade texto para el artículo'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// No creamos un modelo a partir de este esquema porque será usado de forma anidada.
// Lo exportamos para poder usarlo en shoppingListModel.
module.exports = {
    ShoppingItem: mongoose.model('ShoppingItem', shoppingItemSchema), // Exportamos el modelo por si se necesita
    shoppingItemSchema: shoppingItemSchema
};
