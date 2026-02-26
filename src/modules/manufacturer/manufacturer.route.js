import { Router } from 'express';
import { ManufacturerController } from './manufacturer.controller.js';
import { validate } from '../../middlewares/validate.js';
import { createManufacturerSchema, updateManufacturerSchema } from './manufacturer.validation.js';
import { authenticate } from '../../middlewares/auth.js';
const router = Router();
router.use(authenticate);
router.get('/', ManufacturerController.getAll);
router.get('/:id', ManufacturerController.getById);
router.post('/', validate(createManufacturerSchema), ManufacturerController.create);
router.put('/:id', validate(updateManufacturerSchema), ManufacturerController.update);
router.delete('/:id', ManufacturerController.delete);
export default router;
//# sourceMappingURL=manufacturer.route.js.map