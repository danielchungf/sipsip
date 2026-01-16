import { Router, type Router as RouterType } from 'express';
import { customTypesController } from '../controllers/customTypes.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router: RouterType = Router();

// All routes are protected
router.use(authenticate);

router.post('/', (req, res) => customTypesController.create(req, res));
router.get('/', (req, res) => customTypesController.list(req, res));
router.get('/:id', (req, res) => customTypesController.getById(req, res));
router.put('/:id', (req, res) => customTypesController.update(req, res));
router.delete('/:id', (req, res) => customTypesController.delete(req, res));

export default router;
