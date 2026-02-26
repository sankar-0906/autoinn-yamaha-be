import { IdGeneratorService } from './idGenerator.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const getAllIdGenerators = async (req: any, res: any) => {
    try {
        const data = await IdGeneratorService.getAll();
        return sendSuccess(res, 'ID Generators fetched successfully', data);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const getIdGeneratorById = async (req: any, res: any) => {
    try {
        const data = await IdGeneratorService.getById(req.params.id);
        if (!data) return sendError(res, 'ID Generator not found', 404);
        return sendSuccess(res, 'ID Generator fetched successfully', data);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const createIdGenerator = async (req: any, res: any) => {
    try {
        const data = await IdGeneratorService.create({
            ...req.body,
            createdById: req.user?.id
        });
        return sendSuccess(res, 'ID Generator created successfully', data, 201);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const updateIdGenerator = async (req: any, res: any) => {
    try {
        const data = await IdGeneratorService.update(req.params.id, req.body);
        return sendSuccess(res, 'ID Generator updated successfully', data);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const deleteIdGenerator = async (req: any, res: any) => {
    try {
        await IdGeneratorService.delete(req.params.id);
        return sendSuccess(res, 'ID Generator deleted successfully');
    } catch (error: any) {
        return sendError(res, error.message);
    }
};
