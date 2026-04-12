import { Router } from 'express';
import { VehicleStockInwardController } from './vehicleStockInward.controller.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router();

// Logging middleware for debugging
router.use((req, res, next) => {
    console.log(`[VehicleStockInwardRoute] ${req.method} ${req.url}`);
    next();
});

router.get('/', VehicleStockInwardController.getAll);
router.post('/process-pdf', upload.single('pdf'), VehicleStockInwardController.processPdf as any);
router.post('/', VehicleStockInwardController.create);
router.get('/:id', VehicleStockInwardController.getById);
router.put('/:id', VehicleStockInwardController.update);
router.delete('/:id', VehicleStockInwardController.delete);

export default router;
