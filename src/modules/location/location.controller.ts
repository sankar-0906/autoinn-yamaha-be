import type { Request, Response, NextFunction } from 'express';
import { LocationService } from './location.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export class LocationController {
    static async getCountries(req: Request, res: Response, next: NextFunction) {
        try {
            const countries = await LocationService.getCountries();
            return sendSuccess(res, 'Countries fetched successfully', countries);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async getStates(req: Request, res: Response, next: NextFunction) {
        try {
            const states = await LocationService.getStates(req.params.countryId as string);
            return sendSuccess(res, 'States fetched successfully', states);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async getCities(req: Request, res: Response, next: NextFunction) {
        try {
            const cities = await LocationService.getCities(req.params.stateId as string);
            return sendSuccess(res, 'Cities fetched successfully', cities);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }
}
