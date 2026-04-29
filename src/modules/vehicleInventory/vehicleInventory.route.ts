import { Router } from 'express';
import { VehicleInventoryController } from './vehicleInventory.controller.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

router.use(authenticate);

router.get('/summary', VehicleInventoryController.getSummary);
router.get('/counts', VehicleInventoryController.getCounts);
router.get('/details', VehicleInventoryController.getDetails);

export default router;
