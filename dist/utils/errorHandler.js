import { Prisma } from '@prisma/client';
import { sendError } from './response.js';
export const handleApiError = (res, error) => {
    console.error('[handleApiError] Caught Error:', error.message || error);
    let statusCode = 500;
    let message = 'Internal Server Error';
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unique constraint failed
        if (error.code === 'P2002') {
            statusCode = 409;
            const target = Array.isArray(error.meta?.target)
                ? (error.meta?.target).join(', ')
                : 'specified field';
            message = `Duplicate entry: A record with this ${target} already exists.`;
        }
        // P2025: Record not found
        else if (error.code === 'P2025') {
            statusCode = 404;
            message = error.meta?.cause || 'Record not found.';
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
        message = 'A mandatory field is missing or invalid data type was provided.';
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
