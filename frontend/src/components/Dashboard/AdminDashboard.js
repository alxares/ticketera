// src/components/Dashboard/AdminDashboard.js
import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import ticketService from "../../services/ticketService";


const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {
    fullName: "Admin",
    role: "admin",
  };

  // Estadísticas
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    urgent: 0,
  });
  // Tickets recientes (últimos 5)
  const [recent, setRecent] = useState([]);
  // Conteo por departamento
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    // 1) Cargar métricas
    ticketService.getStats().then((data) => setStats(data));

    // 2) Cargar todos los tickets para recientes y agrupación
    ticketService.getAllTickets().then((tickets) => {
      // Tomamos los últimos 5
      setRecent(tickets.slice(-5).reverse());
      // Agrupamos por department.name
      const grouped = tickets.reduce((acc, t) => {
        const name = t.department?.name || "Sin depto";
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});
      setDepartments(
        Object.entries(grouped).map(([name, count]) => ({ name, count }))
      );
    });
  }, []);

  return (
    <Layout user={user}>
      <div className="dashboard-header">
        <h2>Dashboard</h2>
      </div>

      <div className="dashboard-intro">
        <h3>Admin Dashboard</h3>
        <p>
          Bienvenido, {user.fullName}! Aquí está lo que está sucediendo en todo el
          sistema.
        </p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="card-icon primary">
            <i className="bi bi-ticket-fill" />
          </div>
          <div className="card-body">
            <div className="card-value primary">{stats.total}</div>
            <div className="card-label">Total Tickets</div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon success">
            <i className="bi bi-check-circle-fill" />
          </div>
          <div className="card-body">
            <div className="card-value success">{stats.resolved}</div>
            <div className="card-label">Tickets Resueltos</div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon warning">
            <i className="bi bi-hourglass-split" />
          </div>
          <div className="card-body">
            <div className="card-value warning">{stats.pending}</div>
            <div className="card-label">Tickets Pendientes</div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon danger">
            <i className="bi bi-exclamation-octagon-fill" />
          </div>
          <div className="card-body">
            <div className="card-value danger">{stats.urgent}</div>
            <div className="card-label">Tickets Urgentes</div>
          </div>
        </div>
      </div>

      <div className="dashboard-main">
        {/* Recent Tickets */}
        <div className="recent-card">
          <div className="recent-header">
            <span>Tickets Recientes</span>
            <button className="btn btn-sm btn-primary">Ver Todos</button>
          </div>
          <table className="table recent-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Asunto</th>
                <th>Depto.</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Creado</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((t) => (
                <tr key={t.id}>
                  <td>
                    <a href={`#/tickets/${t.id}`}>#{t.id.substring(0, 8)}</a>
                  </td>
                  <td>{t.title}</td>
                  <td>{t.department?.name}</td>
                  <td>{t.priority}</td>
                  <td>{t.status}</td>
                  <td>
                    {new Date(t.createdAt).toLocaleString(undefined, {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumen por Departamento */}
        <div className="dept-card">
          <h5>Resumen por Departamento</h5>
          {departments.map((d) => (
            <div key={d.name} className="dept-row">
              <span className="dept-name">{d.name}</span>
              <span className="dept-count">{d.count} tickets</span>
              <div className="dept-bar">
                <div
                  className="dept-progress"
                  style={{ width: `${(d.count / stats.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
