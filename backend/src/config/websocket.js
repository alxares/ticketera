import { Server } from 'socket.io';
import prisma from './database.js'; // export default
import dotenv from 'dotenv';

dotenv.config();

let io = null;

/**
 * Inicializa el servidor WebSocket sobre un servidor HTTP
 */
export const initWebSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST'],
    },
  });

  console.log('✅ WebSocket configurado y listo para conexiones.');

  io.on('connection', (socket) => {
    console.log(`🔌 Usuario conectado: ${socket.id}`);

    /**
     * Un usuario se une a su "room" personal para recibir notificaciones privadas
     */
    socket.on('joinTickets', (userId) => {
      socket.join(`user-${userId}`);
      console.log(`👤 Usuario ${userId} se unió a user-${userId}`);
    });

    /**
     * Evento que permite actualizar un ticket en tiempo real
     */
    socket.on('ticketUpdate', async (update) => {
      try {
        const ticket = await prisma.ticket.update({
          where: { id: update.ticketId },
          data: { status: update.status },
        });

        // Notificar al creador del ticket
        io.to(`user-${ticket.creatorId}`).emit('ticketUpdated', ticket);
        console.log(`📢 Ticket actualizado y emitido a user-${ticket.creatorId}`);
      } catch (error) {
        console.error('❌ Error al actualizar ticket vía WebSocket:', error);
        socket.emit('error', 'Error al actualizar el ticket');
      }
    });

    /**
     * Evento de desconexión
     */
    socket.on('disconnect', () => {
      console.log(`⚡ Usuario desconectado: ${socket.id}`);
    });
  });
};

/**
 * Devuelve la instancia actual de Socket.IO
 */
export const getIO = () => io;

/**
 * Emite una notificación personalizada a un usuario desde cualquier parte del backend
 * @param {string} userId - ID del usuario destino
 * @param {object} data - Cuerpo de la notificación
 */
export const emitirNotificacion = (userId, data) => {
  if (!io) {
    return console.warn('⚠️ WebSocket no está inicializado');
  }

  io.to(`user-${userId}`).emit('ticketUpdated', data);
  console.log(`📢 Notificación emitida a user-${userId}:`, data);
};
