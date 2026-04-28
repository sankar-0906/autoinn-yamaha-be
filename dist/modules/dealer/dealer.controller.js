import { DealerService } from './dealer.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
export class DealerController {
    static async getAll(req, res, next) {
        try {
            const query = Object.keys(req.body).length > 0 ? req.body : req.query;
            const result = await DealerService.getAll(query);
            return sendSuccess(res, 'Dealers fetched successfully', result);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async getById(req, res, next) {
        try {
            const dealer = await DealerService.getById(req.params.id);
            if (!dealer)
                return sendError(res, 'Dealer not found', 404);
            return sendSuccess(res, 'Dealer fetched successfully', dealer);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async create(req, res, next) {
        try {
            const dealer = await DealerService.create(req.body);
            return sendSuccess(res, 'Dealer created successfully', dealer, 201);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async update(req, res, next) {
        try {
            const dealer = await DealerService.update(req.params.id, req.body);
            return sendSuccess(res, 'Dealer updated successfully', dealer);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async delete(req, res, next) {
        try {
            await DealerService.delete(req.params.id);
            return sendSuccess(res, 'Dealer deleted successfully');
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
}
