import { z } from 'zod';

/**
 * 🎫 Esquema para crear un nuevo ticket
 * Valida los campos requeridos y opcionales al momento de crear un ticket.
 */
export const createTicketSchema = z.object({
  title: z
    .string()
    .min(3, 'El título es obligatorio y debe tener al menos 3 caracteres'),

  description: z
    .string()
    .min(5, 'La descripción es obligatoria y debe tener al menos 5 caracteres'),

  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
    errorMap: () => ({ message: 'La prioridad es inválida' }),
  }),

  creatorId: z
    .string()
    .uuid('ID del creador inválido'),

  departmentId: z
    .string()
    .uuid('ID del departamento inválido'),

  // Permite indicar si se desea asignar automáticamente o al manager
  assigneeType: z
    .enum(['manager', 'auto'])
    .optional(),

  // Puede venir si se selecciona un usuario manualmente
  assigneeId: z
    .string()
    .uuid('ID del asignado inválido')
    .optional()
    .nullable()
});

/**
 * 🔄 Esquema para actualizar estado de un ticket o asignar responsable
 */
export const updateTicketSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], {
    errorMap: () => ({ message: 'Estado inválido' }),
  }),

  assigneeId: z
    .string()
    .uuid('ID del asignado inválido')
    .optional()
    .nullable(),
});
