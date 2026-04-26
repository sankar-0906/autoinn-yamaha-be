import type { Request, Response, NextFunction } from 'express';
import { DealerService } from './dealer.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import prisma from '../../utils/prisma.js';

export class DealerController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const query = Object.keys(req.body).length > 0 ? req.body : req.query;
            const result = await DealerService.getAll(query);
            return sendSuccess(res, 'Dealers fetched successfully', result);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const dealer = await DealerService.getById(req.params.id!);
            if (!dealer) return sendError(res, 'Dealer not found', 404);
            return sendSuccess(res, 'Dealer fetched successfully', dealer);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const dealer = await DealerService.create(req.body);
            return sendSuccess(res, 'Dealer created successfully', dealer, 201);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const dealer = await DealerService.update(req.params.id!, req.body);
            return sendSuccess(res, 'Dealer updated successfully', dealer);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await DealerService.delete(req.params.id!);
            return sendSuccess(res, 'Dealer deleted successfully');
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }
}
