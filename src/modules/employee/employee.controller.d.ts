import type { Request, Response, NextFunction } from 'express';
export declare class EmployeeController {
    static getAll(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static getCount(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static getById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static create(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static update(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static delete(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=employee.controller.d.ts.map