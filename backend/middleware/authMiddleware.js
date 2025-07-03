const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener el token del encabezado
            token = req.headers.authorization.split(' ')[1];

            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Obtener el usuario del token y adjuntarlo a la solicitud
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Continuar al siguiente middleware o ruta
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'No autorizado, token inválido' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'No autorizado, no se encontró token' });
    }
};

// Se corrige la forma de exportar para que coincida con la importación en las rutas.
module.exports = { protect };
