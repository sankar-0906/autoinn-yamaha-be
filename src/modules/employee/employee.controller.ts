import type { Request, Response, NextFunction } from 'express';
import { EmployeeService } from './employee.service.js';
import bcrypt from 'bcrypt';
import prisma from '../../utils/prisma.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export class EmployeeController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const employees = await EmployeeService.getAll();
            // Return exact format that autoinn frontend expects
            return res.json({
                code: 200,
                msg: "All users fetched",
                data: { 
                    count: employees.length, 
                    users: employees,
                    user: (req as any).user?.id || null 
                }
            });
        } catch (error: any) {
            return res.json({
                code: 500,
                message: "Error getting users",
                data: error
            });
        }
    }

    static async getCount(req: Request, res: Response, next: NextFunction) {
        try {
            const count = await EmployeeService.getCount();
            return sendSuccess(res, 'Employee count fetched successfully', { count });
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const employee = await EmployeeService.getById(req.params.id!);
            if (!employee) return sendError(res, 'Employee not found', 404);
            return sendSuccess(res, 'Employee fetched successfully', employee);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const employee = await EmployeeService.create(req.body);
            return sendSuccess(res, 'Employee created successfully', employee, 201);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const employee = await EmployeeService.update(req.params.id!, req.body);
            return sendSuccess(res, 'Employee updated successfully', employee);
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await EmployeeService.delete(req.params.id!);
            return sendSuccess(res, 'Employee deleted successfully');
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }
}
