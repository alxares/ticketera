import prisma from "../config/database.js";
import { sendMessageSchema } from "../schemas/chat.schema.js";
import { emitirNotificacion } from "../config/websocket.js";

// Enviar mensaje
export const sendMessage = async (req, res) => {
  try {
    const data = sendMessageSchema.parse(req.body);

    const message = await prisma.chatMessage.create({
      data: {
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content,
      },
    });

    // 🔔 Emitir notificación en tiempo real al receptor
    emitirNotificacion(data.receiverId, {
      from: data.senderId,
      message: data.content,
      type: "new-message",
    });

    // 💾 Guardar notificación en la base de datos
    await prisma.notification.create({
      data: {
        userId: data.receiverId,
        type: "new-message",
        message: `Nuevo mensaje recibido`,
        relatedId: message.id, // o null si no querés relacionarlo
      },
    });

    res.status(201).json({ message: "Mensaje enviado.", data: message });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
    }
    console.error("❌ Error al enviar mensaje:", error);
    res.status(500).json({ message: "Error al enviar el mensaje." });
  }
};

// Obtener historial entre dos usuarios
export const getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    if (!user1 || !user2) {
      return res.status(400).json({ message: "Faltan IDs de usuario." });
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        OR: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    res.json(messages);
  } catch (error) {
    console.error("❌ Error al obtener mensajes:", error);
    res.status(500).json({ message: "Error al obtener historial de mensajes." });
  }
};
