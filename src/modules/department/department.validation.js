import Joi from 'joi';
export const createDepartmentSchema = Joi.object({
    role: Joi.string().regex(/^[A-Za-z][a-zA-Z\s]*[a-zA-Z]+$/).required().messages({
        'string.pattern.base': 'Enter Valid Department Name'
    }),
    departmentType: Joi.array().items(Joi.string()).optional(),
    othersAccess: Joi.boolean().optional(),
    createdById: Joi.string().optional(),
    roleAccess: Joi.array().items(Joi.object({
        master: Joi.string().required(),
        subModule: Joi.string().required(),
        access: Joi.object({
            create: Joi.boolean().optional(),
            read: Joi.boolean().optional(),
            update: Joi.boolean().optional(),
            delete: Joi.boolean().optional(),
            print: Joi.boolean().optional()
        }).required()
    })).optional()
});
export const updateDepartmentSchema = Joi.object({
    role: Joi.string().regex(/^[A-Za-z][a-zA-Z\s]*[a-zA-Z]+$/).optional().messages({
        'string.pattern.base': 'Enter Valid Department Name'
    }),
    departmentType: Joi.array().items(Joi.string()).optional(),
    othersAccess: Joi.boolean().optional(),
    roleAccess: Joi.array().items(Joi.object({
        master: Joi.string().required(),
        subModule: Joi.string().required(),
        access: Joi.object({
            create: Joi.boolean().optional(),
            read: Joi.boolean().optional(),
            update: Joi.boolean().optional(),
            delete: Joi.boolean().optional(),
            print: Joi.boolean().optional()
        }).required()
    })).optional()
});
//# sourceMappingURL=department.validation.js.map