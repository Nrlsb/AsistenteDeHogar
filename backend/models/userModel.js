// nrlsb/asistentedehogar/AsistenteDeHogar-ab8ced350d0a76f79702cd5ab21b0004078dffb3/backend/models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    // --- CAMBIO ---
    // Se añadió el campo 'name' para que coincida con la lógica de registro y la expectativa del frontend.
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
}, { timestamps: true });

// Middleware para hashear la contraseña antes de guardarla
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Método para comparar contraseñas
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
