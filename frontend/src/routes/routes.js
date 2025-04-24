import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";


// Auth
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";

// Dashboards
import AdminDashboard from "../components/Dashboard/AdminDashboard";
import ManagerDashboard from "../components/Dashboard/ManagerDashboard";
import UserDashboard from "../components/Dashboard/UserDashboard";

// Tickets
import NewTicket from "../components/Tickets/NewTicket";
import TicketList from "../components/Tickets/TicketList";
import TicketDetails from "../components/Tickets/TicketDetails";

// Administración
import UserManagement from "../components/Users/UserManagement";
import DepartmentManagement from "../components/Departments/DepartmentManagement";

// Chat
import ChatPage from "../components/Chat/ChatPage";
import ChatSelectorPage from "../components/Chat/ChatSelectorPage";

// Reportes y Configuración
import ReportsPage from "../components/Reports/ReportsPage";
import SettingsPage from "../components/Settings/SettingsPage";

// (Opcional) Notificaciones
// import NotificationsPage from "../components/Notifications/NotificationsPage";

const ProtectedRoute = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboards */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <ProtectedRoute roles={["MANAGER"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute roles={["USER"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Tickets */}
        <Route
          path="/new-ticket"
          element={
            <ProtectedRoute roles={["USER", "MANAGER", "ADMIN"]}>
              <NewTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <ProtectedRoute roles={["USER", "MANAGER", "ADMIN"]}>
              <TicketList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ticket/:id"
          element={
            <ProtectedRoute roles={["USER", "MANAGER", "ADMIN"]}>
              <TicketDetails />
            </ProtectedRoute>
          }
        />

        {/* Administración */}
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <DepartmentManagement />
            </ProtectedRoute>
          }
        />

        {/* Chat */}
        <Route
          path="/chat/select"
          element={
            <ProtectedRoute roles={["USER", "MANAGER", "ADMIN"]}>
              <ChatSelectorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute roles={["USER", "MANAGER", "ADMIN"]}>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        {/* Otros */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute roles={["MANAGER", "ADMIN"]}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* (Opcional) Notificaciones */}
        {/*
        <Route
          path="/notifications"
          element={
            <ProtectedRoute roles={["USER", "MANAGER", "ADMIN"]}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        */}

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
