import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../Layout/Layout";
import { getAllTickets, getUserTickets } from "../../services/ticketService";
import { showError } from "../../utils/toast";
import "../../styles/priority.css";

const TicketList = () => {
  const user = JSON.parse(localStorage.getItem("user")) || { fullName: "User", role: "USER", id: "" };
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      let data;
      if (user.role === "ADMIN" || user.role === "MANAGER") {
        data = await getAllTickets();
      } else {
        data = await getUserTickets(user.id);
      }
      setTickets(data);
    } catch (error) {
      showError("Error al cargar tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const formatPriority = (priority) => {
    const classes = {
      LOW: "badge bg-secondary",
      MEDIUM: "badge bg-primary",
      HIGH: "badge bg-warning text-dark",
      URGENT: "badge bg-danger",
    };
    return <span className={classes[priority] || "badge bg-light"}>{priority}</span>;
  };

  const formatStatus = (status) => {
    const classes = {
      OPEN: "badge bg-secondary",
      IN_PROGRESS: "badge bg-info",
      RESOLVED: "badge bg-success",
      CLOSED: "badge bg-dark",
    };
    return <span className={classes[status] || "badge bg-light"}>{status}</span>;
  };

  return (
    <Layout user={user}>
      <h1 className="h3 mb-4">Mis Tickets</h1>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <p>Cargando tickets...</p>
          ) : tickets.length === 0 ? (
            <p>No hay tickets disponibles.</p>
          ) : (
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Departamento</th>
                  <th>Prioridad</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>{ticket.id.slice(0, 6)}...</td>
                    <td>{ticket.title}</td>
                    <td>{ticket.department?.name || "—"}</td>
                    <td>{formatPriority(ticket.priority)}</td>
                    <td>{formatStatus(ticket.status)}</td>
                    <td>
                      <Link to={`/ticket/${ticket.id}`} className="btn btn-sm btn-outline-primary">
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TicketList;
