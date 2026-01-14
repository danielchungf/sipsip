import { Router, type Router as RouterType } from 'express';
import { statsController } from '../controllers/stats.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router: RouterType = Router();

// All routes are protected
router.use(authenticate);

router.get('/daily', (req, res) => statsController.getDailyStats(req, res));
router.get('/aggregated', (req, res) => statsController.getAggregatedStats(req, res));
router.get('/contribution', (req, res) => statsController.getContributionData(req, res));

export default router;
