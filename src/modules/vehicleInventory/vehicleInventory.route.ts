import { Router } from 'express';
import { VehicleInventoryController } from './vehicleInventory.controller.js';

const router = Router();

router.get('/summary', VehicleInventoryController.getSummary);
router.get('/counts', VehicleInventoryController.getCounts);
router.get('/details', VehicleInventoryController.getDetails);

export default router;
