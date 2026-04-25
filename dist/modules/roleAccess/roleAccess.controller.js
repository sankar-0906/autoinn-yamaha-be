import { RoleAccessService } from './roleAccess.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
export class RoleAccessController {
    static async create(req, res) {
        try {
            const roleAccess = await RoleAccessService.create(req.body);
            return sendSuccess(res, 'Role access created successfully', roleAccess, 201);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async getAll(req, res) {
        try {
            const departmentId = req.query.departmentId;
            const data = await RoleAccessService.getAll(departmentId);
            return sendSuccess(res, 'Role access list fetched successfully', data);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async getById(req, res) {
        try {
            const data = await RoleAccessService.getById(req.params.id);
            if (!data)
                return sendError(res, 'Role access not found', 404);
            return sendSuccess(res, 'Role access fetched successfully', data);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async delete(req, res) {
        try {
            await RoleAccessService.delete(req.params.id);
            return sendSuccess(res, 'Role access deleted successfully');
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
}
