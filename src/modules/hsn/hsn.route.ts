import { Router } from 'express';
import { HsnController } from './hsn.controller.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

router.post('/', authenticate, HsnController.createHsn);
router.get('/', authenticate, HsnController.getAllHsns);
router.post('/get', authenticate, HsnController.getAllHsns);
router.get('/:id', authenticate, HsnController.getHsnById);
router.put('/:id', authenticate, HsnController.updateHsn);
router.delete('/:id', authenticate, HsnController.deleteHsn);

export default router;
