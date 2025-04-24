import { Server } from 'socket.io';
import prisma from './database.js'; // conexión a la base de datos
import dotenv from 'dotenv';

dotenv.config();

let io;

/**
 * Inicializa el WebSocket Server
 * @param {http.Server} server - El servidor HTTP de Express
 */
export const initWebSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST'],
    },
  });

  console.log('🟢 WebSocket inicializado');

  io.on('connection', (socket) => {
    console.log(`📡 Usuario conectado: ${socket.id}`);

    // Unirse a una "sala" para recibir eventos personalizados
    socket.on('joinTickets', (userId) => {
      socket.join(`user-${userId}`);
      console.log(`👤 Usuario ${userId} se unió a la sala user-${userId}`);
    });

    // Ejemplo: actualización de ticket y emisión al creador
    socket.on('ticketUpdate', async (update) => {
      try {
        const ticket = await prisma.ticket.update({
          where: { id: update.ticketId },
          data: { status: update.status },
        });

        io.to(`user-${ticket.creatorId}`).emit('ticketUpdated', ticket);
      } catch (error) {
        console.error('❌ Error en ticketUpdate:', error);
        socket.emit('error', 'No se pudo actualizar el ticket');
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Usuario desconectado: ${socket.id}`);
    });
  });
};

/**
 * Devuelve la instancia global de Socket.IO
 */
export const getIO = () => io;
