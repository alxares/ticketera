import prisma from "../config/database.js";

// Obtener todas las notificaciones de un usuario
export const getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(notifications);
  } catch (error) {
    console.error("❌ Error al obtener notificaciones:", error);
    res.status(500).json({ message: "Error al obtener notificaciones" });
  }
};

// Marcar una notificación como leída
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    res.json(updated);
  } catch (error) {
    console.error("❌ Error al marcar notificación como leída:", error);
    res.status(500).json({ message: "Error al actualizar notificación" });
  }
};

// Marcar todas las notificaciones de un usuario como leídas
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    res.json({ message: "Todas las notificaciones fueron marcadas como leídas." });
  } catch (error) {
    console.error("❌ Error al marcar todas como leídas:", error);
    res.status(500).json({ message: "Error al actualizar notificaciones" });
  }
};

// Eliminar una notificación (opcional)
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.notification.delete({
      where: { id },
    });

    res.json({ message: "Notificación eliminada." });
  } catch (error) {
    console.error("❌ Error al eliminar notificación:", error);
    res.status(500).json({ message: "Error al eliminar notificación" });
  }
};
