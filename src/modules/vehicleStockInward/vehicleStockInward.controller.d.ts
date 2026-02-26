import type { Request, Response } from 'express';
interface MulterRequest extends Request {
    file?: Express.Multer.File;
}
export declare class VehicleStockInwardController {
    static processPdf(req: MulterRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static create(req: Request, res: Response): Promise<void>;
    static getAll(req: Request, res: Response): Promise<void>;
    static getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
export {};
//# sourceMappingURL=vehicleStockInward.controller.d.ts.map