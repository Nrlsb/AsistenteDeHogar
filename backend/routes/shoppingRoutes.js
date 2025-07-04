// backend/routes/shoppingRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const ShoppingList = require('../models/shoppingListModel');
const User = require('../models/userModel');

// --- Rutas para Listas de Compras ---

// @desc    Obtener todas las listas de compras del usuario (propias y compartidas)
// @route   GET /api/shopping
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const shoppingLists = await ShoppingList.find({
      $or: [{ user: req.user.id }, { sharedWith: req.user.id }],
    }).populate('user', 'name email'); // Opcional: poblar con datos del propietario
    res.json(shoppingLists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// @desc    Crear una nueva lista de compras
// @route   POST /api/shopping
// @access  Private
router.post('/', protect, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'El nombre es requerido' });
  }

  try {
    const newList = new ShoppingList({
      name,
      user: req.user.id,
      items: [], // Inicialmente vacía
      sharedWith: [],
    });

    const createdList = await newList.save();
    res.status(201).json(createdList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// @desc    Eliminar una lista de compras
// @route   DELETE /api/shopping/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
      const list = await ShoppingList.findById(req.params.id);
  
      if (!list) {
        return res.status(404).json({ message: 'Lista no encontrada' });
      }
  
      // Asegurarse que el usuario es el propietario de la lista
      if (list.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'No autorizado' });
      }
  
      await list.deleteOne(); // Usar deleteOne() en el documento
  
      res.json({ id: req.params.id, message: 'Lista eliminada' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  });

// @desc    Compartir una lista de compras
// @route   PUT /api/shopping/:id/share
// @access  Private
router.put('/:id/share', protect, async (req, res) => {
    const { email } = req.body;
    try {
        const list = await ShoppingList.findById(req.params.id);
        if (!list) {
            return res.status(404).json({ message: 'Lista no encontrada' });
        }
        if (list.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Solo el propietario puede compartir la lista' });
        }
        const userToShareWith = await User.findOne({ email });
        if (!userToShareWith) {
            return res.status(404).json({ message: 'Usuario no encontrado con ese email' });
        }
        if (list.sharedWith.includes(userToShareWith._id) || list.user.equals(userToShareWith._id)) {
            return res.status(400).json({ message: 'La lista ya está compartida con este usuario' });
        }
        list.sharedWith.push(userToShareWith._id);
        await list.save();
        res.json(list);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});


// --- Rutas para Artículos dentro de una Lista ---

// @desc    Añadir un artículo a una lista
// @route   POST /api/shopping/:listId/items
// @access  Private
router.post('/:listId/items', protect, async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ message: 'El texto del artículo es requerido' });
    }
    try {
        const list = await ShoppingList.findById(req.params.listId);
        if (!list) {
            return res.status(404).json({ message: 'Lista no encontrada' });
        }
        // Verificar si el usuario es el propietario o si la lista está compartida con él
        if (list.user.toString() !== req.user.id && !list.sharedWith.includes(req.user.id)) {
            return res.status(401).json({ message: 'No autorizado para añadir artículos a esta lista' });
        }
        const newItem = { text, completed: false };
        list.items.push(newItem);
        await list.save();
        res.status(201).json(list.items[list.items.length - 1]); // Devuelve el nuevo artículo añadido
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// @desc    Actualizar un artículo en una lista
// @route   PUT /api/shopping/:listId/items/:itemId
// @access  Private
router.put('/:listId/items/:itemId', protect, async (req, res) => {
    const { text, completed } = req.body;
    try {
        const list = await ShoppingList.findById(req.params.listId);
        if (!list) {
            return res.status(404).json({ message: 'Lista no encontrada' });
        }
        if (list.user.toString() !== req.user.id && !list.sharedWith.includes(req.user.id)) {
            return res.status(401).json({ message: 'No autorizado' });
        }
        const item = list.items.id(req.params.itemId);
        if (!item) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }

        item.text = text ?? item.text;
        item.completed = completed ?? item.completed;

        await list.save();
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// @desc    Eliminar un artículo de una lista
// @route   DELETE /api/shopping/:listId/items/:itemId
// @access  Private
router.delete('/:listId/items/:itemId', protect, async (req, res) => {
    try {
        const list = await ShoppingList.findById(req.params.listId);
        if (!list) {
            return res.status(404).json({ message: 'Lista no encontrada' });
        }
        if (list.user.toString() !== req.user.id && !list.sharedWith.includes(req.user.id)) {
            return res.status(401).json({ message: 'No autorizado' });
        }
        const item = list.items.id(req.params.itemId);
        if (!item) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        
        item.deleteOne(); // Usar remove() en el subdocumento

        await list.save();
        res.json({ listId: req.params.listId, itemId: req.params.itemId, message: 'Artículo eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});


module.exports = router;
