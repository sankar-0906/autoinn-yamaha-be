import type { Request, Response, NextFunction } from 'express';
import { BranchService } from './branch.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export class BranchController {
    static async getAllBranches(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, size, searchString } = req.body;
            const result = await BranchService.getAllBranches({
                page: page ? parseInt(page as string) : 1,
                size: size ? parseInt(size as string) : 10,
                searchString: searchString as string
            });
            return sendSuccess(res, 'Branches fetched successfully', result);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async getBranchById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            if (!id) return sendError(res, 'ID is required', 400);
            const branch = await BranchService.getBranchById(id);
            if (!branch) return sendError(res, 'Branch not found', 404);
            return sendSuccess(res, 'Branch fetched successfully', branch);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async createBranch(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user?.id;
            const branch = await BranchService.createBranch(req.body, userId);
            return sendSuccess(res, 'Branch created successfully', branch, 201);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async updateBranch(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            if (!id) return sendError(res, 'ID is required', 400);
            const userId = (req as any).user?.id;
            const branch = await BranchService.updateBranch(id, req.body, userId);
            return sendSuccess(res, 'Branch updated successfully', branch);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async deleteBranch(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            if (!id) return sendError(res, 'ID is required', 400);
            const result = await BranchService.deleteBranch(id);
            if (result.code === 300) {
                return sendError(res, result.message, 300);
            }
            return sendSuccess(res, 'Branch deleted successfully');
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }
}
