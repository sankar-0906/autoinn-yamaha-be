import type { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.js';
import { VehicleInventoryService } from './vehicleInventory.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export class VehicleInventoryController {
    static async getSummary(req: AuthRequest, res: Response) {
        try {
            const data = await VehicleInventoryService.getSummary(req.query, req.branchIds);
            sendSuccess(res, 'Inventory summary fetched', data);
        } catch (error: any) {
            sendError(res, error.message);
        }
    }

    static async getCounts(req: AuthRequest, res: Response) {
        try {
            const data = await VehicleInventoryService.getCounts(req.query, req.branchIds);
            sendSuccess(res, 'Inventory counts fetched', data);
        } catch (error: any) {
            sendError(res, error.message);
        }
    }

    static async getDetails(req: AuthRequest, res: Response) {
        try {
            const data = await VehicleInventoryService.getDetails(req.query, req.branchIds);
            sendSuccess(res, 'Inventory details fetched', data);
        } catch (error: any) {
            sendError(res, error.message);
        }
    }
}
