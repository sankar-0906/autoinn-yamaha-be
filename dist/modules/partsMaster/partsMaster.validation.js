import Joi from 'joi';
export const createPartsMasterSchema = Joi.object({
    partNumber: Joi.string().required(),
    partName: Joi.string().optional().allow(null, ''),
    displayName: Joi.string().optional().allow(null, ''),
    oldPartNum: Joi.string().optional().allow(null, ''),
    category: Joi.string().optional().allow(null, ''),
    largeCategoryName: Joi.string().optional().allow(null, ''),
    showInConsumer: Joi.boolean().optional(),
    showInAutoCloud: Joi.boolean().optional(),
    url: Joi.array().items(Joi.string()).optional().allow(null),
    color: Joi.string().optional().allow(null, ''),
    moq: Joi.number().optional().allow(null),
    mrp: Joi.number().optional().allow(null),
    ndp: Joi.number().optional().allow(null),
    hsnId: Joi.string().optional().allow(null, ''),
    manufacturerId: Joi.string().optional().allow(null, ''),
    wefDate: Joi.date().optional().allow(null),
    partStatus: Joi.string().optional().allow(null, ''),
    remarks: Joi.string().optional().allow(null, ''),
    size: Joi.string().optional().allow(null, ''),
    mainPartNumber: Joi.string().optional().allow(null, ''),
    createdById: Joi.string().optional().allow(null, ''),
    vehicleSuit: Joi.array().items(Joi.object({
        id: Joi.string().optional().allow(null, ''),
        vehicle: Joi.string().required()
    })).optional().allow(null)
});
export const updatePartsMasterSchema = Joi.object({
    partNumber: Joi.string().optional(),
    partName: Joi.string().optional().allow(null, ''),
    displayName: Joi.string().optional().allow(null, ''),
    oldPartNum: Joi.string().optional().allow(null, ''),
    category: Joi.string().optional().allow(null, ''),
    largeCategoryName: Joi.string().optional().allow(null, ''),
    showInConsumer: Joi.boolean().optional(),
    showInAutoCloud: Joi.boolean().optional(),
    url: Joi.array().items(Joi.string()).optional().allow(null),
    color: Joi.string().optional().allow(null, ''),
    moq: Joi.number().optional().allow(null),
    mrp: Joi.number().optional().allow(null),
    ndp: Joi.number().optional().allow(null),
    hsnId: Joi.string().optional().allow(null, ''),
    manufacturerId: Joi.string().optional().allow(null, ''),
    wefDate: Joi.date().optional().allow(null),
    partStatus: Joi.string().optional().allow(null, ''),
    remarks: Joi.string().optional().allow(null, ''),
    size: Joi.string().optional().allow(null, ''),
    mainPartNumber: Joi.string().optional().allow(null, ''),
    vehicleSuit: Joi.array().items(Joi.object({
        id: Joi.string().optional().allow(null, ''),
        vehicle: Joi.string().required()
    })).optional().allow(null)
});
