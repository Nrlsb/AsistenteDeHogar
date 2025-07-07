// CORRECCIÓN: Se usa import en lugar de require
import mongoose from 'mongoose';

const mealPlanSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            unique: true,
        },
        Lunes: { Desayuno: String, Almuerzo: String, Cena: String },
        Martes: { Desayuno: String, Almuerzo: String, Cena: String },
        Miércoles: { Desayuno: String, Almuerzo: String, Cena: String },
        Jueves: { Desayuno: String, Almuerzo: String, Cena: String },
        Viernes: { Desayuno: String, Almuerzo: String, Cena: String },
        Sábado: { Desayuno: String, Almuerzo: String, Cena: String },
        Domingo: { Desayuno: String, Almuerzo: String, Cena: String },
    },
    {
        timestamps: true,
        collection: 'mealplan' 
    }
);

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

// CORRECCIÓN: Se usa export default en lugar de module.exports
export default MealPlan;
