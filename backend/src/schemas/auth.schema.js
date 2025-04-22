import { z } from 'zod';

// Esquema para el registro de usuario
export const registerSchema = z.object({
  fullName: z.string().min(3, 'El nombre completo es obligatorio'),
  username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  email: z.string().email('Debe ser un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  departmentId: z.string().uuid().optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'USER']).default('USER')
});

// Esquema para login (acepta username o email)
export const loginSchema = z.object({
  usernameOrEmail: z.string().min(3, 'Debe ingresar su usuario o email'),
  password: z.string().min(6, 'Debe ingresar su contraseña'),
});
