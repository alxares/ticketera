import express from "express";
import {
  getNotificationsByUser,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

// 🔄 Obtener todas las notificaciones de un usuario
router.get("/user/:userId", getNotificationsByUser);

// ✅ Marcar una notificación como leída
router.patch("/:id/read", markAsRead);

// ✅ Marcar todas las notificaciones como leídas
router.patch("/user/:userId/read-all", markAllAsRead);

// ❌ Eliminar una notificación (opcional)
router.delete("/:id", deleteNotification);

export default router;
