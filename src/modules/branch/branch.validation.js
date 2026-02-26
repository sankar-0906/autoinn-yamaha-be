import Joi from 'joi';
export const createBranchSchema = Joi.object({
    name: Joi.string().required(),
    branchType: Joi.string().optional(),
    gst: Joi.string().optional(),
    companyId: Joi.string().optional(),
    senderId: Joi.string().optional(),
    email: Joi.string().email().optional(),
    url: Joi.string().uri().optional(),
    lat: Joi.number().optional(),
    lon: Joi.number().optional(),
    addressId: Joi.string().optional(),
});
export const updateBranchSchema = Joi.object({
    name: Joi.string().optional(),
    branchType: Joi.string().optional(),
    gst: Joi.string().optional(),
    companyId: Joi.string().optional(),
    senderId: Joi.string().optional(),
    email: Joi.string().email().optional(),
    url: Joi.string().uri().optional(),
    lat: Joi.number().optional(),
    lon: Joi.number().optional(),
    addressId: Joi.string().optional(),
});
//# sourceMappingURL=branch.validation.js.map