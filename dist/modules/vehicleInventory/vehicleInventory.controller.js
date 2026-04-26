import { VehicleInventoryService } from './vehicleInventory.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
export class VehicleInventoryController {
    static async getSummary(req, res) {
        try {
            const data = await VehicleInventoryService.getSummary(req.query);
            sendSuccess(res, 'Inventory summary fetched', data);
        }
        catch (error) {
            sendError(res, error.message);
        }
    }
    static async getCounts(req, res) {
        try {
            const data = await VehicleInventoryService.getCounts(req.query);
            sendSuccess(res, 'Inventory counts fetched', data);
        }
        catch (error) {
            sendError(res, error.message);
        }
    }
    static async getDetails(req, res) {
        try {
            const data = await VehicleInventoryService.getDetails(req.query);
            sendSuccess(res, 'Inventory details fetched', data);
        }
        catch (error) {
            sendError(res, error.message);
        }
    }
}
