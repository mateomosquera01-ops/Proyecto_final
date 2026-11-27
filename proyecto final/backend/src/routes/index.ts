import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import catalogsRoutes from '../modules/catalogs/catalogs.routes';
import categoriesRoutes from '../modules/categories/categories.routes';
import inquiriesRoutes from '../modules/inquiries/inquiries.routes';
import leadsRoutes from '../modules/leads/leads.routes';
import productsRoutes from '../modules/products/products.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    service: 'textech-api',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/leads', leadsRoutes);
router.use('/products', productsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/catalogs', catalogsRoutes);
router.use('/inquiries', inquiriesRoutes);

export default router;
