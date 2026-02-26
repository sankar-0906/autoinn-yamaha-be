import Joi from 'joi';
const imageSchema = Joi.object({
    id: Joi.string().optional(),
    color: Joi.string().required(),
    code: Joi.string().required(),
    url: Joi.string().optional().allow(null, '')
});
export const createVehicleMasterSchema = Joi.object({
    modelName: Joi.string().required(),
    manufacturerId: Joi.string().required(),
    modelCode: Joi.string().optional().allow(null, ''),
    category: Joi.string().optional().allow(null, ''),
    vehicleStatus: Joi.string().optional().allow(null, ''),
    createdById: Joi.string().optional(),
    images: Joi.array().items(imageSchema).optional()
});
export const updateVehicleMasterSchema = Joi.object({
    modelName: Joi.string().optional(),
    manufacturerId: Joi.string().optional(),
    modelCode: Joi.string().optional().allow(null, ''),
    category: Joi.string().optional().allow(null, ''),
    vehicleStatus: Joi.string().optional().allow(null, ''),
    images: Joi.array().items(imageSchema).optional()
});
//# sourceMappingURL=vehicleMaster.validation.js.map