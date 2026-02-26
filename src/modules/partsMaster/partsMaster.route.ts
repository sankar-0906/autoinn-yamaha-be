import { Router } from 'express';
import { PartsMasterController } from './partsMaster.controller.js';
import { validate } from '../../middlewares/validate.js';
import { createPartsMasterSchema, updatePartsMasterSchema } from './partsMaster.validation.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', PartsMasterController.getAll);
router.get('/:id', PartsMasterController.getById);
router.post('/', validate(createPartsMasterSchema), PartsMasterController.create);
router.put('/:id', validate(updatePartsMasterSchema), PartsMasterController.update);
router.delete('/:id', PartsMasterController.delete);

export default router;
