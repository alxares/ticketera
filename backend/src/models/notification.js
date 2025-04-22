import prisma from "../config/database.js";

/**
 * Crea una notificación para un usuario.
 * @param {String} userId - ID del usuario que recibe la notificación.
 * @param {String} message - Mensaje de la notificación.
 * @param {String} [type="general"] - Tipo de notificación (ej: "ticket", "chat", "sistema").
 * @param {String|null} [relatedId=null] - ID relacionado (ticketId, mensajeId, etc.).
 */
export const notifyUser = async (userId, message, type = "general", relatedId = null) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        message,
        relatedId,
      },
    });
    return notification;
  } catch (error) {
    console.error("❌ Error al crear notificación:", error);
    throw error;
  }
};
