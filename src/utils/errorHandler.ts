import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { sendError } from './response.js';

export const handleApiError = (res: Response, error: any) => {
    console.error('[handleApiError] Caught Error:', error.message || error);

    // Suppress database connection errors
    if (error.message?.includes('Too many database connections opened') ||
        error.message?.includes('remaining connection slots are reserved') ||
        error.code === 'P1001' ||
        error.code === 'P1002') {
        console.log('[SUPPRESSED] Database connection error in API:', error.message);
        return sendError(res, 'Service temporarily unavailable', 503);
    }

    let statusCode = 500;
    let message = 'Internal Server Error';

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unique constraint failed
        if (error.code === 'P2002') {
            statusCode = 409;
            const target = Array.isArray(error.meta?.target)
                ? (error.meta?.target as string[]).join(', ')
                : 'specified field';
            message = `Duplicate entry: A record with this ${target} already exists.`;
        }
        // P2025: Record not found
        else if (error.code === 'P2025') {
            statusCode = 404;
            message = (error.meta?.cause as string) || 'Record not found.';
        }
        // P2003: Foreign key constraint failed
        else if (error.code === 'P2003') {
            statusCode = 400;
            const field = error.meta?.field_name || 'record';
            message = `Foreign key constraint failed on the field: ${field}. The referenced record does not exist.`;
        }
        else {
            statusCode = 400;
            // Get the last line of Prisma error which is usually the most descriptive
            const lines = error.message.split('\n');
            message = `Database Error: ${lines[lines.length - 1] || 'Invalid request'}`;
        }
    }
    // Prisma Validation Error
    else if (error instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        const missingMatch = error.message.match(/Argument `(.*?)` is missing/);
        if (missingMatch) {
            message = `The field "${missingMatch[1]}" is mandatory.`;
        } else {
            message = 'A mandatory field is missing or invalid data was provided.';
        }
    }
    // Generic validation errors
    else if (error.name === 'ValidationError') {
        statusCode = 400;
        message = error.message;
    }
    // General / Unknown errors
    else {
        message = error.message || 'An unexpected error occurred';
    }

    return sendError(res, message, statusCode);
};
