import type { Request, Response } from 'express';
export declare class RoleAccessController {
    static create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=roleAccess.controller.d.ts.map