import type { Request, Response } from 'express';
import { BranchService } from './branch.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export class BranchController {
    static async createBranch(req: Request, res: Response) {
        try {
            // undefined when called during onboarding (no token) — avoids FK violation
            const userId: string | undefined = (req as any).user?.id ?? undefined;
            const branch = await BranchService.createBranch(req.body, userId);
            return sendSuccess(res, 'Branch created successfully', branch, 201);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async getAllBranches(req: Request, res: Response) {
        try {
            const data = await BranchService.getAllBranches(req.query);
            return sendSuccess(res, 'Branches fetched successfully', data);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async getBranchById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if (!id) return sendError(res, 'ID is required', 400);
            const branch = await BranchService.getBranchById(id);
            if (!branch) {
                return sendError(res, 'Branch not found', 404);
            }
            return sendSuccess(res, 'Branch fetched successfully', branch);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async updateBranch(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if (!id) return sendError(res, 'ID is required', 400);
            const branch = await BranchService.updateBranch(id, req.body);
            return sendSuccess(res, 'Branch updated successfully', branch);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async deleteBranch(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if (!id) return sendError(res, 'ID is required', 400);
            await BranchService.deleteBranch(id);
            return sendSuccess(res, 'Branch deleted successfully');
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }
}
