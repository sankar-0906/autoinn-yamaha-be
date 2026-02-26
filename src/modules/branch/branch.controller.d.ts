import type { Request, Response } from 'express';
export declare class BranchController {
    static createBranch(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAllBranches(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getBranchById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateBranch(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static deleteBranch(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=branch.controller.d.ts.map