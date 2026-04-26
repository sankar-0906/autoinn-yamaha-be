import type { Request, Response, NextFunction } from 'express';
import { PartsMasterService } from './partsMaster.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import prisma from '../../utils/prisma.js';

export class PartsMasterController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const query = Object.keys(req.body).length > 0 ? req.body : req.query;
            const result = await PartsMasterService.getAll(query);
            return sendSuccess(res, 'Parts fetched successfully', result);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const part = await PartsMasterService.getById(req.params.id!);
            if (!part) return sendError(res, 'Part not found', 404);
            return sendSuccess(res, 'Part fetched successfully', part);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const part = await PartsMasterService.create(req.body);
            return sendSuccess(res, 'Part created successfully', part, 201);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const part = await PartsMasterService.update(req.params.id!, req.body);
            return sendSuccess(res, 'Part updated successfully', part);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await PartsMasterService.delete(req.params.id!);
            return sendSuccess(res, 'Part deleted successfully');
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }
}
