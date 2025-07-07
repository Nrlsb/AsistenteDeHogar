// CORRECCIÓN: Se usa la sintaxis de import
import express from 'express';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Función para generar un token JWT
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        console.error('FATAL ERROR: La variable de entorno JWT_SECRET no está definida.');
        throw new Error('La configuración del servidor es incorrecta.');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Autenticar un usuario y obtener token
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
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error('Error durante el inicio de sesión:', error.message);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// @desc    Registrar un nuevo usuario
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }
        const user = await User.create({ name, email, password });
        if (user) {
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
        console.error('Error durante el registro:', error.message);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// @desc    Obtener datos del usuario
router.get('/me', protect, async (req, res) => {
    res.status(200).json(req.user);
});

// CORRECCIÓN: Se usa export default
export default router;
