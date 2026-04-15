import { Router } from 'express';
import { VehicleStockInwardController } from './vehicleStockInward.controller.js';
import multer from 'multer';
import formidable from 'formidable';
const upload = multer({ dest: 'uploads/' });
const router = Router();
// Configure formidable for file uploads
const parseForm = (req) => {
    return new Promise((resolve, reject) => {
        const form = formidable({ multiples: false });
        form.parse(req, (err, fields, files) => {
            if (err)
                reject(err);
            else
                resolve({ fields, files });
        });
    });
};
// Logging middleware for debugging
router.use((req, res, next) => {
    console.log(`[VehicleStockInwardRoute] ${req.method} ${req.url}`);
    next();
});
router.get('/', VehicleStockInwardController.getAll);
router.post('/process-pdf', async (req, res) => {
    try {
        console.log('[VehicleStockInwardRoute] Process PDF called');
        const result = await parseForm(req);
        const files = result.files;
        const pdfFile = files.pdf?.[0];
        if (!pdfFile) {
            return res.status(400).json({ success: false, message: 'No PDF file uploaded' });
        }
        // Create a mock multer file object for compatibility
        const mockFile = {
            originalname: pdfFile.originalFilename,
            path: pdfFile.filepath,
            size: pdfFile.size
        };
        await VehicleStockInwardController.processPdf({ ...req, file: mockFile }, res);
    }
    catch (error) {
        console.error('[VehicleStockInwardRoute] Error in process-pdf:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});
router.post('/', VehicleStockInwardController.create);
router.get('/:id', VehicleStockInwardController.getById);
router.put('/:id', VehicleStockInwardController.update);
router.delete('/:id', VehicleStockInwardController.delete);
export default router;
//# sourceMappingURL=vehicleStockInward.route.js.map