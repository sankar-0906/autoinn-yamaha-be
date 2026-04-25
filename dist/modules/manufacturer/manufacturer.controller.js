import { ManufacturerService } from './manufacturer.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
export class ManufacturerController {
    static async getAll(req, res, next) {
        try {
            const manufacturers = await ManufacturerService.getAll();
            return sendSuccess(res, 'Manufacturers fetched successfully', manufacturers);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async getById(req, res, next) {
        try {
            const manufacturer = await ManufacturerService.getById(req.params.id);
            if (!manufacturer)
                return sendError(res, 'Manufacturer not found', 404);
            return sendSuccess(res, 'Manufacturer fetched successfully', manufacturer);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async create(req, res, next) {
        try {
            const manufacturer = await ManufacturerService.create(req.body);
            return sendSuccess(res, 'Manufacturer created successfully', manufacturer, 201);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async update(req, res, next) {
        try {
            const manufacturer = await ManufacturerService.update(req.params.id, req.body);
            return sendSuccess(res, 'Manufacturer updated successfully', manufacturer);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async delete(req, res, next) {
        try {
            await ManufacturerService.delete(req.params.id);
            return sendSuccess(res, 'Manufacturer deleted successfully');
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
}
