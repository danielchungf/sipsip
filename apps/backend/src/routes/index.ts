import { Router, type Router as RouterType } from 'express';
import authRoutes from './auth.routes.js';
import entriesRoutes from './entries.routes.js';
import statsRoutes from './stats.routes.js';
import customTypesRoutes from './customTypes.routes.js';
import companionsRoutes from './companions.routes.js';

const router: RouterType = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/entries', entriesRoutes);
router.use('/stats', statsRoutes);
router.use('/custom-types', customTypesRoutes);
router.use('/companions', companionsRoutes);

export default router;
