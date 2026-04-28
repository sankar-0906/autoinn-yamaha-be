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
router.post('/process-pdf', upload.single('pdf'), VehicleStockInwardController.processPdf);
router.post('/', VehicleStockInwardController.create);
// Static GET routes must come before dynamic /:id routes
router.get('/lookup-image', VehicleStockInwardController.lookupVehicleImage);
// Other static routes
router.post('/recover-data', VehicleStockInwardController.recoverVehicleData);
router.get('/job/:jobId', VehicleStockInwardController.getJobStatus);
// Dynamic routes
router.get('/:id', VehicleStockInwardController.getById);
router.put('/:id', VehicleStockInwardController.update);
router.delete('/:id', VehicleStockInwardController.delete);
export default router;
