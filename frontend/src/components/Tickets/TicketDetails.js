import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../Layout/Layout";
import { getTicketById } from "../../services/ticketService";
import { showError } from "../../utils/toast";

const TicketDetails = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user")) || { fullName: "User", role: "USER" };

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await getTicketById(id);
        setTicket(data);
      } catch (error) {
        showError("No se pudo cargar el ticket.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) return <Layout user={user}><p>Cargando...</p></Layout>;
  if (!ticket) return <Layout user={user}><p>No se encontró el ticket.</p></Layout>;

  return (
    <Layout user={user}>
      <h1 className="h3 mb-4">Ticket #{ticket.id}</h1>

      <div className="card">
        <div className="card-body">
          <p><strong>Título:</strong> {ticket.title}</p>
          <p><strong>Departamento:</strong> {ticket.department?.name}</p>
          <p><strong>Prioridad:</strong> {ticket.priority}</p>
          <p><strong>Estado:</strong> {ticket.status}</p>
          <p><strong>Asignado a:</strong> {ticket.assignee?.fullName || "Sin asignar"}</p>
          <p><strong>Creado:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
          <hr />
          <p><strong>Descripción:</strong></p>
          <p>{ticket.description}</p>

          {/* Archivos adjuntos */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <>
              <hr />
              <p><strong>Archivos Adjuntos:</strong></p>
              <ul>
                {ticket.attachments.map((file) => (
                  <li key={file.id}>
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      {file.name}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TicketDetails;
