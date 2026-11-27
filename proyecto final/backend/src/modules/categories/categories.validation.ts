import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio').max(120),
  slug: z.string().min(2, 'El slug es obligatorio').max(140),
  description: z.string().max(500).optional(),
  parentId: z.string().uuid().nullable().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
