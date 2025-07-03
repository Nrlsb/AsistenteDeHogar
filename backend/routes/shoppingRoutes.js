const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
// Se corrige la importación para desestructurar los modelos correctamente
const { ShoppingItem, ShoppingCategory } = require('../models/shoppingModels');

// @route   GET /api/shopping
// @desc    Obtener todos los artículos de compra
router.get('/', protect, async (req, res) => {
    try {
        const items = await ShoppingItem.find({ user: req.user.id });
        res.json(items);
    } catch (err) {
        console.error('ERROR AL OBTENER ARTÍCULOS DE COMPRA:', err);
        res.status(500).send('Error del Servidor');
    }
});

// @route   POST /api/shopping
// @desc    Añadir un nuevo artículo
router.post('/', protect, async (req, res) => {
    const { name } = req.body;
    try {
        const newItem = new ShoppingItem({
            user: req.user.id,
            name
        });
        const item = await newItem.save();
        res.json(item);
    } catch (err) {
        console.error('ERROR AL AÑADIR ARTÍCULO DE COMPRA:', err);
        res.status(500).send('Error del Servidor');
    }
});

// @route   PUT /api/shopping/:id
// @desc    Actualizar un artículo
router.put('/:id', protect, async (req, res) => {
    try {
        let item = await ShoppingItem.findById(req.params.id);
        if (!item) return res.status(404).json({ msg: 'Artículo no encontrado' });
        if (item.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }
        item = await ShoppingItem.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(item);
    } catch (err) {
        console.error('ERROR AL ACTUALIZAR ARTÍCULO DE COMPRA:', err);
        res.status(500).send('Error del Servidor');
    }
});

// @route   DELETE /api/shopping/:id
// @desc    Eliminar un artículo
router.delete('/:id', protect, async (req, res) => {
    try {
        let item = await ShoppingItem.findById(req.params.id);
        if (!item) return res.status(404).json({ msg: 'Artículo no encontrado' });
        if (item.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }
        await ShoppingItem.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Artículo eliminado' });
    } catch (err) {
        console.error('ERROR AL ELIMINAR ARTÍCULO DE COMPRA:', err);
        res.status(500).send('Error del Servidor');
    }
});

// Aquí podríamos añadir rutas para las categorías en el futuro
// router.post('/categories', protect, ...);

module.exports = router;
