// CORRECCIÓN: Se usa import en lugar de require
import express from 'express';
import MealPlan from '../models/mealPlanModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Obtener el plan de comidas del usuario
// @route   GET /api/meals
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let mealPlan = await MealPlan.findOne({ user: req.user.id });
        
        // Si no existe un plan de comidas, se crea uno vacío para el usuario.
        if (!mealPlan) {
            mealPlan = await MealPlan.create({ user: req.user.id });
        }
        res.json(mealPlan);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el plan de comidas' });
    }
});

// @desc    Actualizar el plan de comidas del usuario 
// @route   PUT /api/meals
// @access  Private
router.put('/', protect, async (req, res) => {
    try {
        const mealPlan = await MealPlan.findOne({ user: req.user.id });

        if (mealPlan) {
            // Se actualizan los campos del plan con los datos enviados en el body
            Object.assign(mealPlan, req.body);
            const updatedMealPlan = await mealPlan.save();
            res.json(updatedMealPlan);
        } else {
            res.status(404).json({ message: 'Plan de comidas no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el plan de comidas' });
    }
});

// CORRECCIÓN: Se usa export default en lugar de module.exports
export default router;
