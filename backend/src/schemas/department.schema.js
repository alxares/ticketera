import { z } from 'zod';

export const createDepartmentSchema = z.object({
  name: z.string().min(3, 'El nombre del departamento es obligatorio'),
  managerId: z.string().uuid('ID del manager inválido').optional(),
});

export const updateDepartmentSchema = z.object({
  name: z.string().min(3, 'El nombre del departamento debe tener al menos 3 caracteres').optional(),
  managerId: z.string().uuid('ID del manager inválido').optional(),
});
