import { Router, type Router as RouterType } from 'express';
import { entriesController } from '../controllers/entries.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router: RouterType = Router();

// All routes are protected
router.use(authenticate);

router.post('/', (req, res) => entriesController.create(req, res));
router.get('/', (req, res) => entriesController.list(req, res));
router.get('/:id', (req, res) => entriesController.getById(req, res));
router.put('/:id', (req, res) => entriesController.update(req, res));
router.delete('/:id', (req, res) => entriesController.delete(req, res));

export default router;
