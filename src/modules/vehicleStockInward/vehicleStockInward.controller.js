import { VehicleStockInwardService } from './vehicleStockInward.service.js';
export class VehicleStockInwardController {
    static async processPdf(req, res) {
        console.log('[VehicleStockInwardController] processPdf started');
        try {
            if (!req.file) {
                console.error('[VehicleStockInwardController] No file uploaded');
                return res.status(400).json({ success: false, message: 'No file uploaded' });
            }
            console.log(`[VehicleStockInwardController] File received: ${req.file.originalname}, Path: ${req.file.path}, Size: ${req.file.size} bytes`);
            const data = await VehicleStockInwardService.processPdf(req.file.path);
            console.log(`[VehicleStockInwardController] PDF processing successful. Sending ${data.VEHICLES.length} vehicles to frontend.`);
            res.json({ success: true, data });
        }
        catch (error) {
            console.error('[VehicleStockInwardController] Error processing PDF:', error);
            res.status(500).json({ success: false, message: error.message, stack: error.stack });
        }
    }
    static async create(req, res) {
        try {
            const createdById = req.user?.id;
            const branchId = req.user?.branchId;
            const data = await VehicleStockInwardService.create(req.body, createdById, branchId);
            res.status(201).json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getAll(req, res) {
        try {
            const branchId = req.user?.branchId;
            const data = await VehicleStockInwardService.getAll({ branchId });
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getById(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ success: false, message: 'ID is required' });
            }
            const data = await VehicleStockInwardService.getById(id);
            if (!data) {
                return res.status(404).json({ success: false, message: 'Record not found' });
            }
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async update(req, res) {
        try {
            const id = req.params.id;
            if (!id)
                return res.status(400).json({ success: false, message: 'ID is required' });
            const data = await VehicleStockInwardService.update(id, req.body);
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async delete(req, res) {
        try {
            const id = req.params.id;
            if (!id)
                return res.status(400).json({ success: false, message: 'ID is required' });
            await VehicleStockInwardService.delete(id);
            res.json({ success: true, message: 'Deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
//# sourceMappingURL=vehicleStockInward.controller.js.map