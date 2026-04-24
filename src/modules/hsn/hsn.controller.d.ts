import type { Request, Response } from 'express';
export declare class HsnController {
    static createHsn(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAllHsns(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getHsnById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateHsn(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static deleteHsn(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=hsn.controller.d.ts.map