const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Función para generar un JSON Web Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Público
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // --- VALIDACIÓN MEJORADA ---
    // Verificamos que se haya enviado una contraseña y que tenga una longitud mínima.
    if (!password || password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    try {
        // Verificamos si el usuario ya existe en la base de datos
        const userExists = await User.findOne({ email });

        if (userExists) {
            // Si el email ya está registrado, enviamos un error claro.
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        // Creamos el nuevo usuario en la base de datos
        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            // Si el usuario se crea con éxito, respondemos con los datos y el token.
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            // Este caso es menos probable, pero cubre otros errores de validación.
            res.status(400).json({ message: 'Datos de usuario inválidos.' });
        }
    } catch (error) {
        // Capturamos cualquier otro error del servidor.
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// @desc    Autenticar usuario y obtener token
// @route   POST /api/auth/login
// @access  Público
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
            res.status(401).json({ message: 'Email o contraseña incorrectos.' });
        }
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

module.exports = router;

