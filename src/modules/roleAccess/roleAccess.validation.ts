import Joi from 'joi';

export const createRoleAccessSchema = Joi.object({
    master: Joi.string().required(),
    subModule: Joi.string().required(),
    departmentId: Joi.string().required(),
    access: Joi.object({
        create: Joi.boolean().default(false),
        update: Joi.boolean().default(false),
        delete: Joi.boolean().default(false),
        read: Joi.boolean().default(false),
        print: Joi.boolean().default(false),
    }).required(),
});

export const updateRoleAccessSchema = Joi.object({
    master: Joi.string().optional(),
    subModule: Joi.string().optional(),
    access: Joi.object({
        create: Joi.boolean().optional(),
        update: Joi.boolean().optional(),
        delete: Joi.boolean().optional(),
        read: Joi.boolean().optional(),
        print: Joi.boolean().optional(),
    }).optional(),
});
