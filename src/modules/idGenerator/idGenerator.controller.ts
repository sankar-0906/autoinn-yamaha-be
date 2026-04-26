import type { Request, Response } from 'express';
import { IdGeneratorService } from './idGenerator.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const getAllIdGenerators = async (req: Request, res: Response) => {
    try {
        const query = Object.keys(req.body).length > 0 ? req.body : req.query;
        const result = await IdGeneratorService.getAll(query);
        return sendSuccess(res, 'ID Generators fetched successfully', result);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const getIdGeneratorById = async (req: Request, res: Response) => {
    try {
        const data = await IdGeneratorService.getById(req.params.id);
        if (!data) return sendError(res, 'ID Generator not found', 404);
        return sendSuccess(res, 'ID Generator fetched successfully', data);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const createIdGenerator = async (req: Request, res: Response) => {
    try {
        const data = await IdGeneratorService.create({
            ...req.body,
            createdById: (req as any).user?.id
        });
        return sendSuccess(res, 'ID Generator created successfully', data, 201);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const updateIdGenerator = async (req: Request, res: Response) => {
    try {
        const data = await IdGeneratorService.update(req.params.id, req.body);
        return sendSuccess(res, 'ID Generator updated successfully', data);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const deleteIdGenerator = async (req: Request, res: Response) => {
    try {
        await IdGeneratorService.delete(req.params.id);
        return sendSuccess(res, 'ID Generator deleted successfully');
    } catch (error: any) {
        return sendError(res, error.message);
    }
};
