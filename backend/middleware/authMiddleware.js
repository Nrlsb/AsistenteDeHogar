const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener el token de la cabecera "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Añadir el id del usuario al objeto request para usarlo en las rutas protegidas
            req.user = { id: decoded.user.id };
            next();
        } catch (error) {
            console.error('Error de autenticación:', error);
            res.status(401).json({ message: 'No autorizado, el token falló' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'No autorizado, no se encontró un token' });
    }
};

module.exports = authMiddleware;
