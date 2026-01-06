import { Router } from 'express';
import authRoutes from './auth.routes.js';
import entriesRoutes from './entries.routes.js';
import statsRoutes from './stats.routes.js';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/entries', entriesRoutes);
router.use('/stats', statsRoutes);

export default router;
