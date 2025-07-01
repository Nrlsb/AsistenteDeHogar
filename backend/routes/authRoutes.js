const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) { return res.status(400).json({ message: 'Por favor, introduce email y contraseña' }); }
    try {
        let user = await User.findOne({ email });
        if (user) { return res.status(400).json({ message: 'El usuario ya existe' }); }
        user = new User({ email, password });
        await user.save();
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token });
        });
    } catch (error) { console.error(error.message); res.status(500).send('Error del servidor'); }
});

// @desc    Autenticar (iniciar sesión) un usuario
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) { return res.status(400).json({ message: 'Por favor, introduce email y contraseña' }); }
    try {
        let user = await User.findOne({ email });
        if (!user) { return res.status(400).json({ message: 'Credenciales inválidas' }); }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) { return res.status(400).json({ message: 'Credenciales inválidas' }); }
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (error) { console.error(error.message); res.status(500).send('Error del servidor'); }
});

module.exports = router;
