import { CompanyService } from './company.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
export class CompanyController {
    static async getAll(req, res, next) {
        try {
            const companies = await CompanyService.getAll();
            return sendSuccess(res, 'Companies fetched successfully', companies);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async getById(req, res, next) {
        try {
            const company = await CompanyService.getById(req.params.id);
            if (!company)
                return sendError(res, 'Company not found', 404);
            return sendSuccess(res, 'Company fetched successfully', company);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async create(req, res, next) {
        try {
            const company = await CompanyService.create(req.body, req.user?.id);
            return sendSuccess(res, 'Company created successfully', company, 201);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async update(req, res, next) {
        try {
            const company = await CompanyService.update(req.params.id, req.body);
            return sendSuccess(res, 'Company updated successfully', company);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async delete(req, res, next) {
        try {
            await CompanyService.delete(req.params.id);
            return sendSuccess(res, 'Company deleted successfully');
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
}
