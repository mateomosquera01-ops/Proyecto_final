import { Router } from 'express';
import { authMiddleware, requireRoles } from '../../middlewares/auth.middleware';
import { validateBody } from '../../middlewares/validation.middleware';
import { inquiriesController } from './inquiries.controller';
import { createInquirySchema, updateInquiryStatusSchema } from './inquiries.validation';

const router = Router();

router.post('/', validateBody(createInquirySchema), inquiriesController.create);
router.get('/', authMiddleware, requireRoles('ADMIN'), inquiriesController.list);
router.patch(
  '/:id/status',
  authMiddleware,
  requireRoles('ADMIN'),
  validateBody(updateInquiryStatusSchema),
  inquiriesController.updateStatus,
);

export default router;
