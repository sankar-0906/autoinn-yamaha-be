import type { Request, Response, NextFunction } from 'express';
export declare class VehicleMasterController {
    static getAll(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static getById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static create(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static update(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static delete(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=vehicleMaster.controller.d.ts.map