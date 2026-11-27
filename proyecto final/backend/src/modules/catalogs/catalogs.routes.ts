import { Router } from 'express';
import { authMiddleware, requireRoles } from '../../middlewares/auth.middleware';
import { validateBody } from '../../middlewares/validation.middleware';
import { catalogsController } from './catalogs.controller';
import { createCatalogSchema } from './catalogs.validation';

const router = Router();

router.get('/', catalogsController.list);
router.post(
  '/',
  authMiddleware,
  requireRoles('ADMIN'),
  validateBody(createCatalogSchema),
  catalogsController.create,
);

export default router;
