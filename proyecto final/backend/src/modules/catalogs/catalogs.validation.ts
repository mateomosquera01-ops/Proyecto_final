import { z } from 'zod';

export const createCatalogSchema = z.object({
  title: z.string().min(3, 'El título es obligatorio').max(180),
  slug: z.string().min(3, 'El slug es obligatorio').max(180),
  description: z.string().max(1000).optional(),
  season: z.string().max(60).optional(),
  pdfUrl: z.string().url('URL de PDF inválida').optional(),
  isActive: z.boolean().optional().default(true),
});

export type CreateCatalogInput = z.infer<typeof createCatalogSchema>;
