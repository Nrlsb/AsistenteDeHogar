const express = require('express');
const router = express.Router();
// Importamos la función 'protect' desde el middleware
const { protect } = require('../middleware/authMiddleware');
const MealPlan = require('../models/mealPlanModel');

// @desc    Obtener el plan de comidas del usuario
// @route   GET /api/meals
// Se añade 'protect' como middleware antes de la lógica de la ruta.
router.get('/', protect, async (req, res) => {
    try {
        let mealPlan = await MealPlan.findOne({ user: req.user.id });
        if (!mealPlan) {
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
// Se añade 'protect' como middleware antes de la lógica de la ruta.
router.put('/', protect, async (req, res) => {
    try {
        const updatedPlan = await MealPlan.findOneAndUpdate(
            { user: req.user.id },
            { $set: req.body },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(updatedPlan);
    } catch (error) {
        console.error('Error updating meal plan:', error);
        res.status(500).send('Error del servidor al actualizar el plan de comidas');
    }
});

module.exports = router;
