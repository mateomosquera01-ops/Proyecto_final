import { z } from 'zod';

export const createProductSchema = z.object({
  sku: z.string().min(3, 'El SKU es obligatorio').max(80),
  name: z.string().min(3, 'El nombre es obligatorio').max(180),
  description: z.string().min(5, 'La descripción es obligatoria').max(2000),
  price: z.coerce.number().positive('El precio debe ser mayor a 0'),
  stock: z.coerce.number().int().min(0, 'El stock no puede ser negativo'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).optional().default('ACTIVE'),
  categoryId: z.string().uuid('Categoría inválida'),
  imageUrl: z.string().url('URL de imagen inválida').optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
