import type { Request, Response, NextFunction } from 'express';
import { VehicleMasterService } from './vehicleMaster.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import prisma from '../../utils/prisma.js';

export class VehicleMasterController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const query = Object.keys(req.body).length > 0 ? req.body : req.query;
            const result = await VehicleMasterService.getAll(query);
            return sendSuccess(res, 'Vehicles fetched successfully', {
                total: result.total,
                vehicles: result.vehicles,
                page: result.page,
                limit: result.limit
            });
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const vehicle = await VehicleMasterService.getById(req.params.id!);
            if (!vehicle) return sendError(res, 'Vehicle not found', 404);
            return sendSuccess(res, 'Vehicle fetched successfully', vehicle);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const vehicle = await VehicleMasterService.create(req.body);
            return sendSuccess(res, 'Vehicle created successfully', vehicle, 201);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const vehicle = await VehicleMasterService.update(req.params.id!, req.body);
            return sendSuccess(res, 'Vehicle updated successfully', vehicle);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await VehicleMasterService.delete(req.params.id!);
            return sendSuccess(res, 'Vehicle deleted successfully');
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async getUniqueModels(req: Request, res: Response) {
        try {
            const models = await VehicleMasterService.getUniqueModelCodes();
            return sendSuccess(res, 'Models fetched', models);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async getColorsByModel(req: Request, res: Response) {
        try {
            const { modelCode } = req.params;
            const colors = await VehicleMasterService.getColorsByModelCode(modelCode as string);
            return sendSuccess(res, 'Colors fetched', colors);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }
}
