const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const MealPlan = require('../models/mealPlanModel');

// Aplicamos el middleware a todas las rutas
router.use(authMiddleware);

// @desc    Obtener el plan de comidas del usuario (lo crea si no existe)
// @route   GET /api/meals
router.get('/', async (req, res) => {
    try {
        let mealPlan = await MealPlan.findOne({ user: req.user.id });
        if (!mealPlan) {
            // Si el usuario no tiene un plan, se crea uno vacío con valores por defecto
            mealPlan = new MealPlan({ user: req.user.id });
            await mealPlan.save();
        }
        res.json(mealPlan);
    } catch (error) {
        console.error('Error fetching meal plan:', error);
        res.status(500).send('Error del servidor al obtener el plan de comidas');
    }
});

// @desc    Actualizar el plan de comidas
// @route   PUT /api/meals
router.put('/', async (req, res) => {
    try {
        // Busca el plan del usuario y lo actualiza con los datos del body.
        // La opción { new: true, upsert: true } devuelve el documento actualizado y lo crea si no existe.
        const updatedPlan = await MealPlan.findOneAndUpdate(
            { user: req.user.id },
            { $set: req.body }, // Usamos $set para actualizar solo los campos enviados
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(updatedPlan);
    } catch (error) {
        console.error('Error updating meal plan:', error);
        res.status(500).send('Error del servidor al actualizar el plan de comidas');
    }
});

module.exports = router;
