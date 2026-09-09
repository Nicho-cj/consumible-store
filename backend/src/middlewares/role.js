// @REVISAR: middleware de autorizacion por roles
// Uso: requireRole(['ADMIN_RECEPCION']) o requireRole(['ADMIN_RECEPCION', 'TECNICO'])
// Debe usarse DESPUES del middleware authenticate (req.user debe existir)
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.rol) {
      return res.status(401).json({
        status: 'error',
        message: 'No autenticado',
      });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({
        status: 'error',
        message: `Acceso denegado. Roles permitidos: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
};
