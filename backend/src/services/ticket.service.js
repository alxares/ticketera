import { prisma } from '../config/database.js';
import { sendEmail } from './email.service.js';
import { logger } from '../utils/logger.js';

export const createTicket = async (ticketData, userId) => {
  const ticket = await prisma.ticket.create({
    data: {
      ...ticketData,
      creatorId: userId,
      status: 'OPEN',
    },
    include: {
      department: true,
      creator: true
    }
  });

  await prisma.notification.create({
    data: {
      type: 'TICKET_CREATED',
      message: `Nuevo ticket creado: ${ticket.title}`,
      userId: ticket.department.managerId,
      relatedId: ticket.id
    }
  });

  logger.info(`Ticket creado: ${ticket.id}`);
  
  if (ticket.priority === 'URGENT') {
    await sendEmail({
      to: ticket.department.manager.email,
      subject: 'Ticket Urgente Creado',
      text: `Se ha creado un ticket urgente: ${ticket.title}`
    });
  }

  return ticket;
};

export const getTicketsByUser = async (userId, filters) => {
  const { status, priority, departmentId } = filters;
  
  return prisma.ticket.findMany({
    where: {
      OR: [
        { creatorId: userId },
        { assigneeId: userId }
      ],
      status,
      priority,
      departmentId
    },
    include: {
      department: true,
      assignee: true,
      comments: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};