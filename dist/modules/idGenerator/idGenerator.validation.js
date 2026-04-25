import Joi from 'joi';
export const createIdGeneratorSchema = Joi.object({
    module: Joi.string().required(),
    subModule: Joi.string().required(),
    text: Joi.string().required(),
    startCount: Joi.string().required(),
    count: Joi.string().optional().allow(null, ''),
    scope: Joi.string().required(),
    resetAnnually: Joi.boolean().optional().default(false),
    branchId: Joi.string().optional().allow(null, ''),
    createdById: Joi.string().optional().allow(null, '')
});
export const updateIdGeneratorSchema = Joi.object({
    module: Joi.string().optional(),
    subModule: Joi.string().optional(),
    text: Joi.string().optional(),
    startCount: Joi.string().optional(),
    count: Joi.string().optional().allow(null, ''),
    scope: Joi.string().optional(),
    resetAnnually: Joi.boolean().optional(),
    branchId: Joi.string().optional().allow(null, '')
});
