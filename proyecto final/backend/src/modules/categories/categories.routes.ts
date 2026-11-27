import { Router } from 'express';
import { authMiddleware, requireRoles } from '../../middlewares/auth.middleware';
import { validateBody } from '../../middlewares/validation.middleware';
import { categoriesController } from './categories.controller';
import { createCategorySchema } from './categories.validation';

const router = Router();

router.get('/', categoriesController.list);
router.post(
  '/',
  authMiddleware,
  requireRoles('ADMIN'),
  validateBody(createCategorySchema),
  categoriesController.create,
);

export default router;
