import { LocationService } from './location.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
export class LocationController {
    static async getCountries(req, res, next) {
        try {
            const countries = await LocationService.getCountries();
            return sendSuccess(res, 'Countries fetched successfully', countries);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async getStates(req, res, next) {
        try {
            const states = await LocationService.getStates(req.params.countryId);
            return sendSuccess(res, 'States fetched successfully', states);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async getCities(req, res, next) {
        try {
            const cities = await LocationService.getCities(req.params.stateId);
            return sendSuccess(res, 'Cities fetched successfully', cities);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
}
//# sourceMappingURL=location.controller.js.map