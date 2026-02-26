import type { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';
import logger from '../utils/logger.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(`[${req.method}] ${req.path} — ${err.message}`, {
        stack: err.stack,
        body: req.body,
    });
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    return sendError(res, message, status, err.errors || null);
};
