import { z } from 'zod';

export const sendMessageSchema = z.object({
  senderId: z.string().uuid('ID del remitente inválido'),
  receiverId: z.string().uuid('ID del destinatario inválido'),
  content: z.string().min(1, 'El contenido del mensaje no puede estar vacío'),
});
