import Joi from 'joi';

const imageSchema = Joi.object({
    id: Joi.string().optional().allow(null, ''),
    color: Joi.string().required(),
    code: Joi.string().required(),
    url: Joi.string().optional().allow(null, ''),
    vehicleMasterId: Joi.string().optional().allow(null, ''),
    createdById: Joi.string().optional().allow(null, ''),
    createdAt: Joi.any().optional(),
    updatedAt: Joi.any().optional()
});

const fileSchema = Joi.object({
    id: Joi.string().optional().allow(null, ''),
    name: Joi.string().required(),
    url: Joi.string().required(),
    fileType: Joi.string().required(),
    entity: Joi.string().optional().allow(null, ''),
    vehicleMasterId: Joi.string().optional().allow(null, ''),
    createdById: Joi.string().optional().allow(null, ''),
    createdAt: Joi.any().optional(),
    updatedAt: Joi.any().optional()
});

export const createVehicleMasterSchema = Joi.object({
    modelName: Joi.string().required(),
    manufacturerId: Joi.string().required(),
    modelCode: Joi.string().required(),
    category: Joi.string().required(),
    vehicleStatus: Joi.string().required(),
    createdById: Joi.string().optional(),
    images: Joi.array().items(imageSchema).optional(),
    files: Joi.array().items(fileSchema).optional()
});

export const updateVehicleMasterSchema = Joi.object({
    modelName: Joi.string().optional(),
    manufacturerId: Joi.string().optional(),
    modelCode: Joi.string().optional(),
    category: Joi.string().optional(),
    vehicleStatus: Joi.string().optional(),
    images: Joi.array().items(imageSchema).optional(),
    files: Joi.array().items(fileSchema).optional()
});
