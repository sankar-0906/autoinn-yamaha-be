import type { Request, Response, NextFunction } from 'express';
import { DepartmentService } from './department.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import prisma from '../../utils/prisma.js';
import { handleApiError } from '../../utils/errorHandler.js';

export class DepartmentController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const query = Object.keys(req.body).length > 0 ? req.body : req.query;
            const result = await DepartmentService.getAll(query);
            return sendSuccess(res, 'Departments fetched successfully', result);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const department = await DepartmentService.getById(req.params.id!);
            if (!department) return sendError(res, 'Department not found', 404);
            return sendSuccess(res, 'Department fetched successfully', department);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const department = await DepartmentService.create(req.body);
            return sendSuccess(res, 'Department created successfully', department, 201);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const department = await DepartmentService.update(req.params.id!, req.body);
            return sendSuccess(res, 'Department updated successfully', department);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await DepartmentService.delete(req.params.id!);
            return sendSuccess(res, 'Department deleted successfully');
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }
}
