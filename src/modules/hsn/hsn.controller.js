import { HsnService } from './hsn.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
export class HsnController {
    static async createHsn(req, res) {
        try {
            const userId = req.user?.id;
            const hsn = await HsnService.createHsn(req.body, userId);
            return sendSuccess(res, 'HSN created successfully', hsn, 201);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async getAllHsns(req, res) {
        try {
            const query = Object.keys(req.body).length > 0 ? req.body : req.query;
            const data = await HsnService.getAllHsns(query);
            return sendSuccess(res, 'HSNs fetched successfully', {
                count: data.total,
                hsn: data.hsns,
                page: data.page,
                limit: data.limit
            });
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async getHsnById(req, res) {
        try {
            const { id } = req.params;
            if (!id)
                return sendError(res, 'HSN ID is required', 400);
            const hsn = await HsnService.getHsnById(id);
            if (!hsn)
                return sendError(res, 'HSN not found', 404);
            return sendSuccess(res, 'HSN fetched successfully', hsn);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async updateHsn(req, res) {
        try {
            const { id } = req.params;
            if (!id)
                return sendError(res, 'HSN ID is required', 400);
            const hsn = await HsnService.updateHsn(id, req.body);
            return sendSuccess(res, 'HSN updated successfully', hsn);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async deleteHsn(req, res) {
        try {
            const { id } = req.params;
            if (!id)
                return sendError(res, 'HSN ID is required', 400);
            await HsnService.deleteHsn(id);
            return sendSuccess(res, 'HSN deleted successfully');
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
}
//# sourceMappingURL=hsn.controller.js.map