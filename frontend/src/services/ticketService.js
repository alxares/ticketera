import axiosAuth from "./axiosAuth";

// ✅ Crear un nuevo ticket con posibilidad de archivos adjuntos
export const createTicket = async (data) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("priority", data.priority);
  formData.append("departmentId", data.departmentId);
  formData.append("creatorId", data.creatorId);

  if (data.assigneeId) {
    formData.append("assigneeId", data.assigneeId);
  }

  // 📎 Adjuntar archivos si existen
  if (data.attachments && data.attachments.length > 0) {
    Array.from(data.attachments).forEach((file) => {
      formData.append("files", file);
    });
  }

  const res = await axiosAuth.post("/tickets", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// ✅ Obtener todos los tickets (admin o manager)
export const getAllTickets = async () => {
  const res = await axiosAuth.get("/tickets");
  return res.data;
};

// ✅ Obtener tickets del usuario logueado
export const getUserTickets = async (userId) => {
  const res = await axiosAuth.get(`/tickets/user/${userId}`);
  return res.data;
};

// ✅ Obtener ticket por ID
export const getTicketById = async (id) => {
  const res = await axiosAuth.get(`/tickets/${id}`);
  return res.data;
};

// ✅ Actualizar ticket (asignar responsable o cambiar estado)
export const updateTicket = async (id, data) => {
  const res = await axiosAuth.put(`/tickets/${id}`, data);
  return res.data;
};

// ✅ Eliminar ticket (si aplica)
export const deleteTicket = async (id) => {
  const res = await axiosAuth.delete(`/tickets/${id}`);
  return res.data;
};

// 📊 Obtener estadísticas de tickets
export const getStats = async () => {
  const tickets = await getAllTickets();
  return {
    total:    tickets.length,
    resolved: tickets.filter(t => t.status === 'Resolved').length,
    pending:  tickets.filter(t => t.status === 'Pending').length,
    urgent:   tickets.filter(t => t.priority === 'Urgent').length,
  };
};

// Guardar el objeto en una variable antes de exportar
const ticketService = {
  createTicket,
  getAllTickets,
  getUserTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getStats,
};

export default ticketService;