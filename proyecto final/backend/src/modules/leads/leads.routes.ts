import { Router } from 'express';
import { authMiddleware, requireRoles } from '../../middlewares/auth.middleware';
import { leadRateLimiter } from '../../middlewares/rateLimit.middleware';
import { validateBody } from '../../middlewares/validation.middleware';
import { leadsController } from './leads.controller';
import { createLeadSchema, updateLeadStatusSchema } from './leads.validation';

const router = Router();

router.post('/', leadRateLimiter, validateBody(createLeadSchema), leadsController.create);
router.get('/', authMiddleware, requireRoles('ADMIN'), leadsController.list);
router.patch(
  '/:id/status',
  authMiddleware,
  requireRoles('ADMIN'),
  validateBody(updateLeadStatusSchema),
  leadsController.updateStatus,
);
router.delete('/:id', authMiddleware, requireRoles('ADMIN'), leadsController.remove);

export default router;
