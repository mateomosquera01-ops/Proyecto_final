import { z } from 'zod';

export const createLeadSchema = z.object({
  fullName: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(150, 'El nombre no puede superar los 150 caracteres'),
  email: z
    .string()
    .email('Ingresa un correo electrónico válido')
    .max(255, 'El correo electrónico es demasiado largo'),
  interestRole: z
    .enum(['DISTRIBUTOR', 'DESIGNER', 'BUYER'], {
      errorMap: () => ({ message: 'Selecciona un rol de interés válido' }),
    }),
  message: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje no puede superar los 1000 caracteres'),
  consentGiven: z.literal(true, {
    errorMap: () => ({ message: 'Debes aceptar la política de privacidad para continuar' }),
  }),
  policyVersion: z.string().max(30).optional().default('v1.0'),
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED']),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;
