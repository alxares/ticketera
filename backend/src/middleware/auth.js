import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware para verificar si el usuario está autenticado
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // El token debe venir en formato: Bearer token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Agregamos los datos del usuario al objeto req para que esté disponible en otras rutas
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ Token inválido:', error.message);
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

export default verifyToken;
