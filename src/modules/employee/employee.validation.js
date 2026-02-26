import Joi from 'joi';
export const createEmployeeSchema = Joi.object({
    email: Joi.string().email().optional(),
    phone: Joi.string().required(),
    phone2: Joi.string().optional(),
    password: Joi.string().min(6).required(),
    employee: Joi.boolean().default(true),
    status: Joi.boolean().default(true),
    // Profile fields
    employeeName: Joi.string().required(),
    fatherName: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
    bloodGroup: Joi.string().optional(),
    departmentId: Joi.string().required(),
    branchId: Joi.string().optional().allow(null),
    aadhaarNumber: Joi.string().optional(),
    panNumber: Joi.string().optional(),
    drivingLicense: Joi.string().optional(),
    dateOfJoining: Joi.date().optional(),
    // Bank Details
    ifscCode: Joi.string().optional(),
    accountNumber: Joi.string().optional(),
    accountHolder: Joi.string().optional(),
    bankName: Joi.string().optional(),
});
export const updateEmployeeSchema = Joi.object({
    email: Joi.string().email().optional().allow(null),
    phone: Joi.string().optional().allow(null),
    phone2: Joi.string().optional().allow(null),
    password: Joi.string().min(6).optional().allow(null),
    status: Joi.boolean().optional().allow(null),
    employee: Joi.boolean().optional().allow(null),
    // Profile fields
    employeeName: Joi.string().optional().allow(null),
    fatherName: Joi.string().optional().allow(null),
    dateOfBirth: Joi.date().optional().allow(null),
    bloodGroup: Joi.string().optional().allow(null),
    departmentId: Joi.string().optional().allow(null),
    branchId: Joi.string().optional().allow(null),
    aadhaarNumber: Joi.string().optional().allow(null),
    panNumber: Joi.string().optional().allow(null),
    drivingLicense: Joi.string().optional().allow(null),
    dateOfJoining: Joi.date().optional().allow(null),
    // Bank Details
    ifscCode: Joi.string().optional().allow(null),
    accountNumber: Joi.string().optional().allow(null),
    accountHolder: Joi.string().optional().allow(null),
    bankName: Joi.string().optional().allow(null),
});
//# sourceMappingURL=employee.validation.js.map