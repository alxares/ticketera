import { z } from 'zod';

export const updateSettingsSchema = z.object({
  language: z.string().min(2, 'El idioma debe tener al menos 2 caracteres').optional(),
  theme: z.enum(['light', 'dark']).optional(),
  notificationsEnabled: z.boolean().optional(),
});
