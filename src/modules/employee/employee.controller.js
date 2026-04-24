import { EmployeeService } from './employee.service.js';
import bcrypt from 'bcrypt';
import prisma from '../../utils/prisma.js';
import { sendSuccess, sendError } from '../../utils/response.js';
export class EmployeeController {
    static async getAll(req, res, next) {
        try {
            const employees = await EmployeeService.getAll();
            // Return exact format that autoinn frontend expects
            return res.json({
                code: 200,
                msg: "All users fetched",
                data: {
                    count: employees.length,
                    users: employees,
                    user: req.user?.id || null
                }
            });
        }
        catch (error) {
            return res.json({
                code: 500,
                message: "Error getting users",
                data: error
            });
        }
    }
    static async getCount(req, res, next) {
        try {
            const count = await EmployeeService.getCount();
            return sendSuccess(res, 'Employee count fetched successfully', { count });
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async getById(req, res, next) {
        try {
            const employee = await EmployeeService.getById(req.params.id);
            if (!employee)
                return sendError(res, 'Employee not found', 404);
            return sendSuccess(res, 'Employee fetched successfully', employee);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async create(req, res, next) {
        try {
            const employee = await EmployeeService.create(req.body);
            return sendSuccess(res, 'Employee created successfully', employee, 201);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async update(req, res, next) {
        try {
            const employee = await EmployeeService.update(req.params.id, req.body);
            return sendSuccess(res, 'Employee updated successfully', employee);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
    static async delete(req, res, next) {
        try {
            await EmployeeService.delete(req.params.id);
            return sendSuccess(res, 'Employee deleted successfully');
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
}
//# sourceMappingURL=employee.controller.js.map