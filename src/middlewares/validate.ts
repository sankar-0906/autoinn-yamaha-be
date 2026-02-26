import type { Request, Response, NextFunction } from 'express';
import type { ObjectSchema } from 'joi';
import { sendError } from '../utils/response.js';

export const validate = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessage = error.details.map((detail: any) => detail.message).join(', ');
            return sendError(res, errorMessage, 400);
        }
        next();
    };
};
