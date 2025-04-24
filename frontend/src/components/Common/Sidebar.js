import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // ✅ Cierre de sesión
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ Verifica si la ruta actual está activa
  const isActive = (path) => location.pathname === path;

  // ✅ Alternar modo colapsado
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar shadow-sm bg-white border-end vh-100 ${collapsed ? "collapsed" : ""}`}>
      
      {/* ✅ Encabezado con botón de colapso */}
      <div className="d-flex justify-content-between align-items-center mb-4 px-2">
        <h5 className={`fw-bold text-primary d-flex align-items-center ${collapsed ? "d-none" : ""}`}>
          <i className="bi bi-ticket-detailed-fill me-2"></i> Ticketera Mirca
        </h5>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={toggleSidebar}
          title="Expandir/Colapsar"
        >
          <i className={`bi ${collapsed ? "bi-arrow-bar-right" : "bi-arrow-bar-left"}`}></i>
        </button>
      </div>

      <ul className="nav flex-column gap-2 px-1">

        {/* ✅ Dashboard */}
        <li>
          <Link
            title="Dashboard"
            className={`nav-link d-flex align-items-center ${isActive(`/${role.toLowerCase()}/dashboard`) ? "fw-bold text-primary" : ""}`}
            to={`/${role.toLowerCase()}/dashboard`}
          >
            <i className="bi bi-speedometer2 me-2"></i>
            {!collapsed && "Dashboard"}
          </Link>
        </li>

        {/* ✅ Ver tickets */}
        <li>
          <Link
            title="Ver tus tickets"
            className={`nav-link d-flex align-items-center ${isActive("/tickets") ? "fw-bold text-primary" : ""}`}
            to="/tickets"
          >
            <i className="bi bi-receipt-cutoff me-2"></i>
            {!collapsed && "Tickets"}
          </Link>
        </li>

        {/* ✅ Crear nuevo ticket (disponible para todos los roles) */}
        <li>
          <Link
            title="Nuevo ticket"
            className={`nav-link d-flex align-items-center ${isActive("/new-ticket") ? "fw-bold text-primary" : ""}`}
            to="/new-ticket"
          >
            <i className="bi bi-plus-square me-2"></i>
            {!collapsed && "New Ticket"}
          </Link>
        </li>

        {/* ✅ Chat */}
        <li>
          <Link
            title="Chat"
            className={`nav-link d-flex align-items-center ${isActive("/chat") ? "fw-bold text-primary" : ""}`}
            to="/chat"
          >
            <i className="bi bi-chat-dots me-2"></i>
            {!collapsed && "Chat"}
          </Link>
        </li>

        {/* 🔹 Separador */}
        <div className="sidebar-separator" />

        {/* ✅ Administración: Usuarios y Departamentos (solo admin) */}
        {role === "ADMIN" && (
          <>
            <li>
              <Link
                title="Usuarios"
                className={`nav-link d-flex align-items-center ${isActive("/users") ? "fw-bold text-primary" : ""}`}
                to="/users"
              >
                <i className="bi bi-people me-2"></i>
                {!collapsed && "Users"}
              </Link>
            </li>
            <li>
              <Link
                title="Departamentos"
                className={`nav-link d-flex align-items-center ${isActive("/departments") ? "fw-bold text-primary" : ""}`}
                to="/departments"
              >
                <i className="bi bi-building me-2"></i>
                {!collapsed && "Departments"}
              </Link>
            </li>
          </>
        )}

        {/* ✅ Reportes (admin y manager) */}
        {(role === "ADMIN" || role === "MANAGER") && (
          <li>
            <Link
              title="Reportes"
              className={`nav-link d-flex align-items-center ${isActive("/reports") ? "fw-bold text-primary" : ""}`}
              to="/reports"
            >
              <i className="bi bi-bar-chart me-2"></i>
              {!collapsed && "Reports"}
            </Link>
          </li>
        )}

        {/* ✅ Configuraciones (solo admin) */}
        {role === "ADMIN" && (
          <li>
            <Link
              title="Settings"
              className={`nav-link d-flex align-items-center ${isActive("/settings") ? "fw-bold text-primary" : ""}`}
              to="/settings"
            >
              <i className="bi bi-gear me-2"></i>
              {!collapsed && "Settings"}
            </Link>
          </li>
        )}

        {/* 🔹 Separador */}
        <div className="sidebar-separator mt-2 mb-2" />

        {/* ✅ Cierre de sesión */}
        <li>
          <button
            title="Cerrar sesión"
            className="btn btn-light text-danger w-100 d-flex align-items-center justify-content-start"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            {!collapsed && "Logout"}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
