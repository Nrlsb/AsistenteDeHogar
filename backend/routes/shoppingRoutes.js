const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { ShoppingCategory, ShoppingItem } = require('../models/shoppingModels');

// Aplicamos el middleware a todas las rutas de este archivo
router.use(authMiddleware);

// --- RUTAS DE CATEGORÍAS ---

// @desc    Obtener todas las categorías de compras del usuario
// @route   GET /api/shopping/categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await ShoppingCategory.find({ user: req.user.id }).sort({ createdAt: 'asc' });
        res.json(categories);
    } catch (error) {
        res.status(500).send('Error del servidor');
    }
});

// @desc    Crear una nueva categoría de compras
// @route   POST /api/shopping/categories
router.post('/categories', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'El nombre es obligatorio' });
    try {
        const category = new ShoppingCategory({ name, user: req.user.id });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).send('Error del servidor');
    }
});

// @desc    Eliminar una categoría y todos sus items
// @route   DELETE /api/shopping/categories/:id
router.delete('/categories/:id', async (req, res) => {
    try {
        const category = await ShoppingCategory.findOne({ _id: req.params.id, user: req.user.id });
        if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });

        // Eliminar todos los items asociados a esta categoría
        await ShoppingItem.deleteMany({ category: req.params.id, user: req.user.id });
        // Eliminar la categoría
        await category.deleteOne();
        
        res.json({ message: 'Categoría y sus productos eliminados' });
    } catch (error) {
        res.status(500).send('Error del servidor');
    }
});


// --- RUTAS DE PRODUCTOS ---

// @desc    Obtener todos los productos de compras del usuario
// @route   GET /api/shopping/items
router.get('/items', async (req, res) => {
    try {
        const items = await ShoppingItem.find({ user: req.user.id });
        res.json(items);
    } catch (error) {
        res.status(500).send('Error del servidor');
    }
});

// @desc    Crear un nuevo producto de compra
// @route   POST /api/shopping/items
router.post('/items', async (req, res) => {
    const { name, categoryId } = req.body;
    if (!name || !categoryId) return res.status(400).json({ message: 'Nombre y categoría son obligatorios' });
    try {
        const item = new ShoppingItem({ name, category: categoryId, user: req.user.id });
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(500).send('Error del servidor');
    }
});

// @desc    Actualizar un producto (marcar/desmarcar como comprado)
// @route   PUT /api/shopping/items/:id
router.put('/items/:id', async (req, res) => {
    try {
        const item = await ShoppingItem.findOne({ _id: req.params.id, user: req.user.id });
        if (!item) return res.status(404).json({ message: 'Producto no encontrado' });

        item.purchased = !item.purchased;
        await item.save();
        res.json(item);
    } catch (error) {
        res.status(500).send('Error del servidor');
    }
});

// @desc    Eliminar todos los productos comprados
// @route   DELETE /api/shopping/items/purchased
router.delete('/items/purchased', async (req, res) => {
    try {
        await ShoppingItem.deleteMany({ user: req.user.id, purchased: true });
        res.json({ message: 'Productos comprados eliminados' });
    } catch (error) {
        res.status(500).send('Error del servidor');
    }
});


module.exports = router;
