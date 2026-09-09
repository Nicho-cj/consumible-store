import jwt from 'jsonwebtoken';

// @REVISAR: middleware de autenticacion - verifica JWT en header Authorization: Bearer <token>
// Si el token es valido, adjunta req.user con { id, nombre, rol }
// Si no hay token o es invalido, retorna 401
const JWT_SECRET = process.env.JWT_SECRET || 'consumible-store-secret-key';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Token de autenticación no proporcionado',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token de autenticación inválido o expirado',
    });
  }
};

// @REVISAR: exportar el secret para que otros modulos lo usen (auth controller para firmar tokens)
export { JWT_SECRET };
