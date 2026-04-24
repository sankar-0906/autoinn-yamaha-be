import type { Request, Response, NextFunction } from 'express';
export declare class BranchController {
    static getAllBranches(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static getBranchById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static createBranch(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static updateBranch(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    static deleteBranch(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=branch.controller.d.ts.map