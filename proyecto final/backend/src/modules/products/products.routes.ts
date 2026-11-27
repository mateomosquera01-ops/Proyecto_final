import { Router } from 'express';
import { authMiddleware, requireRoles } from '../../middlewares/auth.middleware';
import { validateBody } from '../../middlewares/validation.middleware';
import { productsController } from './products.controller';
import { createProductSchema, updateProductSchema } from './products.validation';

const router = Router();

router.get('/', productsController.list);
router.get('/:id', productsController.getById);
router.post(
  '/',
  authMiddleware,
  requireRoles('ADMIN'),
  validateBody(createProductSchema),
  productsController.create,
);
router.put(
  '/:id',
  authMiddleware,
  requireRoles('ADMIN'),
  validateBody(updateProductSchema),
  productsController.update,
);
router.delete('/:id', authMiddleware, requireRoles('ADMIN'), productsController.remove);

export default router;
