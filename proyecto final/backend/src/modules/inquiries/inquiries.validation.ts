import { z } from 'zod';

export const createInquirySchema = z.object({
  productId: z.string().uuid('Producto inválido').optional(),
  contactName: z.string().min(3, 'El nombre es obligatorio').max(150),
  contactEmail: z.string().email('Correo electrónico inválido').max(255),
  quantity: z.coerce.number().int().min(1, 'La cantidad mínima es 1').max(100000),
  notes: z.string().min(5, 'Las notas son obligatorias').max(1500),
});

export const updateInquiryStatusSchema = z.object({
  status: z.enum(['OPEN', 'IN_REVIEW', 'QUOTED', 'CLOSED']),
  comment: z.string().max(500).optional(),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
export type UpdateInquiryStatusInput = z.infer<typeof updateInquiryStatusSchema>;
