import { Router } from 'express';
import { VehicleMasterController } from './vehicleMaster.controller.js';
import { validate } from '../../middlewares/validate.js';
import { createVehicleMasterSchema, updateVehicleMasterSchema } from './vehicleMaster.validation.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', VehicleMasterController.getAll);
router.get('/models', VehicleMasterController.getUniqueModels);
router.get('/colors/:modelCode', VehicleMasterController.getColorsByModel);
router.get('/:id', VehicleMasterController.getById);
router.post('/', validate(createVehicleMasterSchema), VehicleMasterController.create);
router.put('/:id', validate(updateVehicleMasterSchema), VehicleMasterController.update);
router.delete('/:id', VehicleMasterController.delete);

export default router;
