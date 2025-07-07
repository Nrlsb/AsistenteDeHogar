// CORRECCIÓN: Se usa import en lugar de require
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// CORRECCIÓN: Se usa la sintaxis de export para una función nombrada
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener token del header
            token = req.headers.authorization.split(' ')[1];

            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Obtener usuario del token y adjuntarlo al objeto request
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                 return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'No autorizado, el token falló' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'No autorizado, no se proporcionó un token' });
    }
};
