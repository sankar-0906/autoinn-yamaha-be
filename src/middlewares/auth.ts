import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.js';
import { ENV } from '../config/env.js';

const JWT_SECRET = ENV.JWT_SECRET;


export interface AuthRequest extends Request {
    user?: any;
    branchIds?: string[];
}

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authReq = req as AuthRequest;
    const authHeader = authReq.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendError(res, 'Authorization token missing or invalid', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token!, JWT_SECRET);
        authReq.user = decoded;

        // Extract branch IDs from header
        const branchIdsHeader = req.headers['x-branch-ids'];
        if (branchIdsHeader) {
            try {
                authReq.branchIds = JSON.parse(branchIdsHeader as string);
            } catch (e) {
                authReq.branchIds = [];
            }
        }

        next();
    } catch (error) {
        return sendError(res, 'Invalid or expired token', 401);
    }
};
