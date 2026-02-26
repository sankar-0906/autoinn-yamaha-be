import { PartsMasterService } from './partsMaster.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import prisma from '../../utils/prisma.js';
export class PartsMasterController {
    static async getAll(req, res, next) {
        try {
            const parts = await PartsMasterService.getAll();
            return sendSuccess(res, 'Parts fetched successfully', parts);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async getById(req, res, next) {
        try {
            const part = await PartsMasterService.getById(req.params.id);
            if (!part)
                return sendError(res, 'Part not found', 404);
            return sendSuccess(res, 'Part fetched successfully', part);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async create(req, res, next) {
        try {
            const part = await PartsMasterService.create(req.body);
            return sendSuccess(res, 'Part created successfully', part, 201);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async update(req, res, next) {
        try {
            const part = await PartsMasterService.update(req.params.id, req.body);
            return sendSuccess(res, 'Part updated successfully', part);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async delete(req, res, next) {
        try {
            await PartsMasterService.delete(req.params.id);
            return sendSuccess(res, 'Part deleted successfully');
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
}
//# sourceMappingURL=partsMaster.controller.js.map