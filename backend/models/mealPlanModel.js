const mongoose = require('mongoose');

const MealPlanSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', unique: true },
    Lunes: { Desayuno: String, Almuerzo: String, Cena: String },
    Martes: { Desayuno: String, Almuerzo: String, Cena: String },
    Miércoles: { Desayuno: String, Almuerzo: String, Cena: String },
    Jueves: { Desayuno: String, Almuerzo: String, Cena: String },
    Viernes: { Desayuno: String, Almuerzo: String, Cena: String },
    Sábado: { Desayuno: String, Almuerzo: String, Cena: String },
    Domingo: { Desayuno: String, Almuerzo: String, Cena: String }
}, { 
    timestamps: true,
    minimize: false // importante para guardar los días aunque estén vacíos
});

module.exports = mongoose.model('MealPlan', MealPlanSchema);
