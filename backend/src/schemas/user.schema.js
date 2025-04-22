import { z } from 'zod';

export const createUserSchema = z.object({
  fullName: z.string().min(3, 'El nombre completo es obligatorio'),
  username: z.string().min(3, 'El nombre de usuario es obligatorio'),
  email: z.string().email('Debe ser un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['USER', 'MANAGER', 'ADMIN']),
  departmentId: z.string().uuid('ID de departamento inválido').optional(),
});

export const updateUserSchema = z.object({
  fullName: z.string().min(3).optional(),
  email: z.string().email().optional(),
  role: z.enum(['USER', 'MANAGER', 'ADMIN']).optional(),
  departmentId: z.string().uuid().optional(),
});
