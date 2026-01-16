import { Router, type Router as RouterType } from 'express';
import { companionsController } from '../controllers/companions.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router: RouterType = Router();

// All routes are protected
router.use(authenticate);

router.post('/', (req, res) => companionsController.create(req, res));
router.get('/', (req, res) => companionsController.list(req, res));
router.get('/:id', (req, res) => companionsController.getById(req, res));
router.put('/:id', (req, res) => companionsController.update(req, res));
router.delete('/:id', (req, res) => companionsController.delete(req, res));

export default router;
