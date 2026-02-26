import type { Request, Response, NextFunction } from 'express';
import { ManufacturerService } from './manufacturer.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import prisma from '../../utils/prisma.js';

export class ManufacturerController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const manufacturers = await ManufacturerService.getAll();
            return sendSuccess(res, 'Manufacturers fetched successfully', manufacturers);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const manufacturer = await ManufacturerService.getById(req.params.id!);
            if (!manufacturer) return sendError(res, 'Manufacturer not found', 404);
            return sendSuccess(res, 'Manufacturer fetched successfully', manufacturer);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const manufacturer = await ManufacturerService.create(req.body);
            return sendSuccess(res, 'Manufacturer created successfully', manufacturer, 201);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const manufacturer = await ManufacturerService.update(req.params.id!, req.body);
            return sendSuccess(res, 'Manufacturer updated successfully', manufacturer);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await ManufacturerService.delete(req.params.id!);
            return sendSuccess(res, 'Manufacturer deleted successfully');
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }
}
