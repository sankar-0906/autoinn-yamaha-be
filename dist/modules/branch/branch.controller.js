import { BranchService } from './branch.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
export class BranchController {
    static async getAllBranches(req, res, next) {
        try {
            const { page, size, searchString } = req.body;
            const result = await BranchService.getAllBranches({
                page: page ? parseInt(page) : 1,
                size: size ? parseInt(size) : 10,
                searchString: searchString
            });
            return sendSuccess(res, 'Branches fetched successfully', result);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async getBranchById(req, res, next) {
        try {
            const id = req.params.id;
            if (!id)
                return sendError(res, 'ID is required', 400);
            const branch = await BranchService.getBranchById(id);
            if (!branch)
                return sendError(res, 'Branch not found', 404);
            return sendSuccess(res, 'Branch fetched successfully', branch);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async createBranch(req, res, next) {
        try {
            const userId = req.user?.id;
            const branch = await BranchService.createBranch(req.body, userId);
            return sendSuccess(res, 'Branch created successfully', branch, 201);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async updateBranch(req, res, next) {
        try {
            const id = req.params.id;
            if (!id)
                return sendError(res, 'ID is required', 400);
            const userId = req.user?.id;
            const branch = await BranchService.updateBranch(id, req.body, userId);
            return sendSuccess(res, 'Branch updated successfully', branch);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async deleteBranch(req, res, next) {
        try {
            const id = req.params.id;
            if (!id)
                return sendError(res, 'ID is required', 400);
            const result = await BranchService.deleteBranch(id);
            if (result.code === 300) {
                return sendError(res, result.message, 300);
            }
            return sendSuccess(res, 'Branch deleted successfully');
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
}
