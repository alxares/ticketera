import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { io } from "socket.io-client";
import {
  getUserNotifications,
  markNotificationAsRead,
} from "../../services/notificationService";

const Topbar = ({ user }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  // Conectar al WebSocket + cargar notificaciones persistentes
  useEffect(() => {
    const s = io(process.env.REACT_APP_SOCKET_URL);
    setSocket(s);

    s.emit("joinTickets", user.id);

    s.on("ticketUpdated", (data) => {
      setNotifications((prev) => [
        { id: Date.now().toString(), message: data.message || "Nueva notificación", read: false },
        ...prev,
      ]);
    });

    // Cargar desde API
    const fetchNotifications = async () => {
      const data = await getUserNotifications(user.id);
      setNotifications(data);
    };

    fetchNotifications();

    return () => {
      s.disconnect();
    };
  }, [user.id]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMarkAsRead = async (notificationId) => {
    await markNotificationAsRead(notificationId);
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="topbar d-flex justify-content-between align-items-center p-3 border-bottom bg-white">
      <div className="topbar-left">
        <h4 className="mb-0">Dashboard</h4>
      </div>

      <div className="topbar-right d-flex align-items-center gap-3">
        {/* 🔔 Notificaciones */}
        <div className="dropdown">
          <button
            className="btn btn-link position-relative"
            data-bs-toggle="dropdown"
          >
            <i className="bi bi-bell fs-5"></i>
            {unreadCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {unreadCount}
              </span>
            )}
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <li
                  key={n.id}
                  className={`dropdown-item small ${
                    n.read ? "text-muted" : "fw-bold"
                  }`}
                  onClick={() => handleMarkAsRead(n.id)}
                  style={{ cursor: "pointer" }}
                >
                  {n.message}
                </li>
              ))
            ) : (
              <li className="dropdown-item text-muted">Sin notificaciones</li>
            )}
          </ul>
        </div>

        {/* Perfil 👤 */}
        <div className="dropdown">
          <a
            href="#"
            className="user-dropdown d-flex align-items-center"
            data-bs-toggle="dropdown"
          >
            <div className="avatar me-2">
              <img
                src={`https://ui-avatars.com/api/?name=${user.fullName}&background=4361ee&color=fff`}
                alt="Avatar"
                className="rounded-circle"
                width="40"
                height="40"
              />
            </div>
            <div className="user-info d-none d-md-block text-start">
              <div className="user-name fw-semibold">{user.fullName}</div>
              <div className="user-role text-muted text-capitalize">{user.role}</div>
            </div>
            <i className="bi bi-chevron-down ms-2"></i>
          </a>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <a className="dropdown-item" href="#">
                <i className="bi bi-person me-2"></i> Perfil
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                <i className="bi bi-gear me-2"></i> Configuración
              </a>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i> Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
