import { VehicleMasterService } from './vehicleMaster.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import prisma from '../../utils/prisma.js';
export class VehicleMasterController {
    static async getAll(req, res, next) {
        try {
            const vehicles = await VehicleMasterService.getAll();
            return res.status(200).json({
                code: 200,
                response: {
                    code: 200,
                    msg: 'VehiclesMaster fetched',
                    data: {
                        count: vehicles.length,
                        VehicleMaster: vehicles
                    }
                }
            });
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async getById(req, res, next) {
        try {
            const vehicle = await VehicleMasterService.getById(req.params.id);
            if (!vehicle)
                return sendError(res, 'Vehicle not found', 404);
            return sendSuccess(res, 'Vehicle fetched successfully', vehicle);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async create(req, res, next) {
        try {
            const vehicle = await VehicleMasterService.create(req.body);
            return sendSuccess(res, 'Vehicle created successfully', vehicle, 201);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async update(req, res, next) {
        try {
            const vehicle = await VehicleMasterService.update(req.params.id, req.body);
            return sendSuccess(res, 'Vehicle updated successfully', vehicle);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async delete(req, res, next) {
        try {
            await VehicleMasterService.delete(req.params.id);
            return sendSuccess(res, 'Vehicle deleted successfully');
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async getUniqueModels(req, res) {
        try {
            const models = await VehicleMasterService.getUniqueModelCodes();
            return sendSuccess(res, 'Models fetched', models);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async getColorsByModel(req, res) {
        try {
            const { modelCode } = req.params;
            const colors = await VehicleMasterService.getColorsByModelCode(modelCode);
            return sendSuccess(res, 'Colors fetched', colors);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
}
//# sourceMappingURL=vehicleMaster.controller.js.map