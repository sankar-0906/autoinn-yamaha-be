import Joi from 'joi';

const addressSchema = Joi.object({
    id: Joi.string().optional().allow(null, ''),
    line1: Joi.string().required(),
    line2: Joi.string().optional().allow(null, ''),
    line3: Joi.string().optional().allow(null, ''),
    locality: Joi.string().required(),
    cityId: Joi.string().optional().allow(null, ''),
    stateId: Joi.string().optional().allow(null, ''),
    countryId: Joi.string().optional().allow(null, ''),
    pincode: Joi.string().required(),
    contactPerson: Joi.string().optional().allow(null, ''),
    phoneNumber: Joi.string().optional().allow(null, ''),
    branchId: Joi.string().optional().allow(null, ''),
    branch: Joi.string().optional().allow(null, ''),
    createdAt: Joi.any().optional(),
    updatedAt: Joi.any().optional(),
    createdBy: Joi.any().optional(),
    dealerShippingId: Joi.any().optional()
});

export const createDealerSchema = Joi.object({
    name: Joi.string().required(),
    dealerCode: Joi.string().optional().allow(null, ''),
    dealerType: Joi.string().optional().allow(null, ''),
    GSTIN: Joi.string().optional().allow(null, ''),
    password: Joi.string().optional().allow(null, ''),
    status: Joi.string().optional().allow(null, ''),
    email: Joi.string().email().optional().allow(null, ''),
    remarks: Joi.string().optional().allow(null, ''),
    createdById: Joi.string().optional().allow(null, ''),
    address: addressSchema.required(),
    shippingAddress: Joi.array().items(addressSchema).optional().allow(null)
});

export const updateDealerSchema = Joi.object({
    name: Joi.string().optional(),
    dealerCode: Joi.string().optional().allow(null, ''),
    dealerType: Joi.string().optional().allow(null, ''),
    GSTIN: Joi.string().optional().allow(null, ''),
    password: Joi.string().optional().allow(null, ''),
    status: Joi.string().optional().allow(null, ''),
    email: Joi.string().email().optional().allow(null, ''),
    remarks: Joi.string().optional().allow(null, ''),
    address: addressSchema.optional(),
    shippingAddress: Joi.array().items(addressSchema).optional().allow(null)
});
