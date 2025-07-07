// nrlsb/asistentedehogar/AsistenteDeHogar-ab8ced350d0a76f79702cd5ab21b0004078dffb3/backend/routes/authRoutes.js
const express = require('express');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Función para generar el token
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        console.error('FATAL ERROR: La variable de entorno JWT_SECRET no está definida.');
        throw new Error('JWT Secret not configured on the server.');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const user = await User.create({ name, email, password });

        if (user) {
            // --- CORRECCIÓN ---
            // Se eliminó la 'p' que causaba el SyntaxError.
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Datos de usuario inválidos' });
        }
    } catch (error) {
        console.error('ERROR DURANTE EL REGISTRO:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Email o contraseña inválidos' });
        }
    } catch (error) {
        console.error('ERROR DURANTE EL LOGIN:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('ERROR OBTENIENDO PERFIL:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

module.exports = router;
