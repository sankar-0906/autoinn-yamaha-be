import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.js';
import { ENV } from '../config/env.js';

const JWT_SECRET = ENV.JWT_SECRET;


export interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendError(res, 'Authorization token missing or invalid', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token!, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return sendError(res, 'Invalid or expired token', 401);
    }
};
