import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

/**
 * Componente de ruta protegida
 * @param {JSX.Element} children - El componente a mostrar si está autorizado
 * @param {Array} roles - Lista de roles permitidos (ej: ["ADMIN"])
 */
const PrivateRoute = ({ children, roles }) => {
  const user = getCurrentUser();

  // Si no hay usuario logueado, redirige al login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si el rol del usuario no está permitido, redirige al dashboard correspondiente
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
  }

  return children;
};

export default PrivateRoute;
