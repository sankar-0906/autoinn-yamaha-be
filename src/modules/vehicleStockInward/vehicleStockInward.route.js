import { Router } from 'express';
import { VehicleStockInwardController } from './vehicleStockInward.controller.js';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });
const router = Router();
router.get('/', VehicleStockInwardController.getAll);
router.post('/process-pdf', upload.single('pdf'), VehicleStockInwardController.processPdf);
router.post('/', VehicleStockInwardController.create);
router.get('/:id', VehicleStockInwardController.getById);
export default router;
//# sourceMappingURL=vehicleStockInward.route.js.map