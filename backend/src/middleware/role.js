/**
 * Middleware que permite el acceso solo a usuarios con ciertos roles
 * @param {...string} roles - Lista de roles permitidos (ej: 'ADMIN', 'MANAGER')
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      const user = req.user;
  
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Acceso denegado: permisos insuficientes' });
      }
  
      next();
    };
  };
  
  export default authorizeRoles;
  