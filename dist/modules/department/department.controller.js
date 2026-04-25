import { DepartmentService } from './department.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
export class DepartmentController {
    static async getAll(req, res, next) {
        try {
            const departments = await DepartmentService.getAll();
            return sendSuccess(res, 'Departments fetched successfully', departments);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async getById(req, res, next) {
        try {
            const department = await DepartmentService.getById(req.params.id);
            if (!department)
                return sendError(res, 'Department not found', 404);
            return sendSuccess(res, 'Department fetched successfully', department);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async create(req, res, next) {
        try {
            const department = await DepartmentService.create(req.body);
            return sendSuccess(res, 'Department created successfully', department, 201);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async update(req, res, next) {
        try {
            const department = await DepartmentService.update(req.params.id, req.body);
            return sendSuccess(res, 'Department updated successfully', department);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async delete(req, res, next) {
        try {
            await DepartmentService.delete(req.params.id);
            return sendSuccess(res, 'Department deleted successfully');
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
}
