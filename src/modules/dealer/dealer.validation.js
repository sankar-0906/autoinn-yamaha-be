import Joi from 'joi';
const addressSchema = Joi.object({
    line1: Joi.string().required(),
    line2: Joi.string().optional().allow(null, ''),
    line3: Joi.string().optional().allow(null, ''),
    locality: Joi.string().required(),
    cityId: Joi.string().optional().allow(null, ''),
    stateId: Joi.string().optional().allow(null, ''),
    countryId: Joi.string().optional().allow(null, ''),
    pincode: Joi.string().required()
});
export const createDealerSchema = Joi.object({
    name: Joi.string().required(),
    dealerType: Joi.string().optional().allow(null, ''),
    GSTIN: Joi.string().optional().allow(null, ''),
    status: Joi.string().optional().allow(null, ''),
    email: Joi.string().email().optional().allow(null, ''),
    remarks: Joi.string().optional().allow(null, ''),
    createdById: Joi.string().optional().allow(null, ''),
    address: addressSchema.required(),
    shippingAddress: Joi.array().items(addressSchema).optional().allow(null)
});
export const updateDealerSchema = Joi.object({
    name: Joi.string().optional(),
    dealerType: Joi.string().optional().allow(null, ''),
    GSTIN: Joi.string().optional().allow(null, ''),
    status: Joi.string().optional().allow(null, ''),
    email: Joi.string().email().optional().allow(null, ''),
    remarks: Joi.string().optional().allow(null, ''),
    address: addressSchema.optional(),
    shippingAddress: Joi.array().items(addressSchema).optional().allow(null)
});
//# sourceMappingURL=dealer.validation.js.map