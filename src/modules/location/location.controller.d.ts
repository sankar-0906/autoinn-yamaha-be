import type { Request, Response, NextFunction } from 'express';
export declare class LocationController {
    static getCountries(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static getStates(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static getCities(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=location.controller.d.ts.map