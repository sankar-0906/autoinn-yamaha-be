import type { Request, Response, NextFunction } from 'express';
import { CompanyService } from './company.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import { handleApiError } from '../../utils/errorHandler.js';

export class CompanyController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const companies = await CompanyService.getAll();
            return sendSuccess(res, 'Companies fetched successfully', companies);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const company = await CompanyService.getById(req.params.id!);
            if (!company) return sendError(res, 'Company not found', 404);
            return sendSuccess(res, 'Company fetched successfully', company);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const company = await CompanyService.create(req.body, (req as any).user?.id);
            return sendSuccess(res, 'Company created successfully', company, 201);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const company = await CompanyService.update(req.params.id!, req.body);
            return sendSuccess(res, 'Company updated successfully', company);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await CompanyService.delete(req.params.id!);
            return sendSuccess(res, 'Company deleted successfully');
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }
}
