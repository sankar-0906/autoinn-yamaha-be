import type { Request, Response } from 'express';
import { FrameNumberService } from './frameNumber.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const getAllFrameNumbers = async (req: Request, res: Response) => {
    try {
        const query = Object.keys(req.body).length > 0 ? req.body : req.query;
        const result = await FrameNumberService.getAll(query);
        return sendSuccess(res, 'Frame Numbers fetched successfully', result);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const getFrameNumberById = async (req: Request, res: Response) => {
    try {
        const data = await FrameNumberService.getById(req.params.id);
        if (!data) return sendError(res, 'Frame Number not found', 404);
        return sendSuccess(res, 'Frame Number fetched successfully', data);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const createFrameNumber = async (req: Request, res: Response) => {
    try {
        const data = await FrameNumberService.create({
            ...req.body,
            createdById: (req as any).user?.id
        });
        return sendSuccess(res, 'Frame Number created successfully', data, 201);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const updateFrameNumber = async (req: Request, res: Response) => {
    try {
        const data = await FrameNumberService.update(req.params.id, req.body);
        return sendSuccess(res, 'Frame Number updated successfully', data);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const deleteFrameNumber = async (req: Request, res: Response) => {
    try {
        await FrameNumberService.delete(req.params.id);
        return sendSuccess(res, 'Frame Number deleted successfully');
    } catch (error: any) {
        return sendError(res, error.message);
    }
};
