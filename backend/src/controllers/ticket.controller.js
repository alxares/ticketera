import prisma from "../config/database.js";
import {
  createTicketSchema,
  updateTicketSchema,
} from "../schemas/ticket.schema.js";
import { emitirNotificacion } from "../config/websocket.js";

// ✅ Crear nuevo ticket con soporte para adjuntos
export const createTicket = async (req, res) => {
  try {
    const body = req.body;

    // 🛡️ Validación con Zod
    const data = createTicketSchema.parse(body);

    // 🧾 Crear el ticket
    const ticket = await prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        creatorId: data.creatorId,
        departmentId: data.departmentId,
        assigneeId: data.assigneeId || null,
      },
    });

    // 📎 Si hay archivos adjuntos, los guardamos
    if (req.files && req.files.length > 0) {
      const attachments = req.files.map((file) => ({
        name: file.originalname,
        url: `/uploads/${file.filename}`,
        type: file.mimetype,
        ticketId: ticket.id,
      }));

      await prisma.attachment.createMany({ data: attachments });
    }

    // 🔔 Emitir notificación al creador en tiempo real
    emitirNotificacion(ticket.creatorId, {
      title: ticket.title,
      status: ticket.status,
      type: "ticket-created",
    });

    // 💾 Guardar notificación en base de datos
    await prisma.notification.create({
      data: {
        userId: ticket.creatorId,
        type: "ticket-created",
        message: `Se creó el ticket "${ticket.title}"`,
        relatedId: ticket.id,
      },
    });

    res.status(201).json(ticket);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
    }
    console.error("❌ Error al crear ticket:", error);
    res.status(500).json({ message: "Error al crear el ticket." });
  }
};

// ✅ Obtener todos los tickets (para Admin y Manager)
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        creator: { select: { id: true, fullName: true } },
        department: true,
        assignee: { select: { id: true, fullName: true } },
        attachments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(tickets);
  } catch (error) {
    console.error("❌ Error al obtener tickets:", error);
    res.status(500).json({ message: "Error al obtener los tickets." });
  }
};

// ✅ Obtener tickets por usuario (modo cliente)
export const getTicketsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const tickets = await prisma.ticket.findMany({
      where: { creatorId: userId },
      include: {
        department: true,
        status: true,
        attachments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(tickets);
  } catch (error) {
    console.error("❌ Error al obtener tickets del usuario:", error);
    res.status(500).json({ message: "Error al obtener los tickets." });
  }
};

// ✅ Obtener detalles de un ticket por ID
export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        creator: true,
        assignee: true,
        department: true,
        comments: true,
        attachments: true,
      },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado." });
    }

    res.json(ticket);
  } catch (error) {
    console.error("❌ Error al obtener ticket:", error);
    res.status(500).json({ message: "Error interno." });
  }
};

// ✅ Actualizar ticket (estado o responsable)
export const updateTicket = async (req, res) => {
  try {
    const data = updateTicketSchema.parse(req.body);
    const { id } = req.params;

    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        status: data.status,
        assigneeId: data.assigneeId,
      },
    });

    // 🔔 Notificar al creador
    emitirNotificacion(ticket.creatorId, {
      title: ticket.title,
      status: ticket.status,
      type: "ticket-updated",
    });

    await prisma.notification.create({
      data: {
        userId: ticket.creatorId,
        type: "ticket-updated",
        message: `El ticket "${ticket.title}" cambió de estado a ${ticket.status}`,
        relatedId: ticket.id,
      },
    });

    // 🔔 Notificar al nuevo asignado
    if (ticket.assigneeId && ticket.assigneeId !== ticket.creatorId) {
      emitirNotificacion(ticket.assigneeId, {
        title: ticket.title,
        status: ticket.status,
        type: "ticket-assigned",
      });

      await prisma.notification.create({
        data: {
          userId: ticket.assigneeId,
          type: "ticket-assigned",
          message: `Se te asignó el ticket "${ticket.title}"`,
          relatedId: ticket.id,
        },
      });
    }

    res.json(ticket);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
    }
    console.error("❌ Error al actualizar ticket:", error);
    res.status(500).json({ message: "No se pudo actualizar el ticket." });
  }
};

// ✅ Eliminar ticket (opcional)
export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.ticket.delete({ where: { id } });

    res.json({ message: "Ticket eliminado correctamente." });
  } catch (error) {
    console.error("❌ Error al eliminar ticket:", error);
    res.status(500).json({ message: "No se pudo eliminar el ticket." });
  }
};
