import Joi from 'joi';

const addressSchema = Joi.object({
    line1: Joi.string().required(),
    line2: Joi.string().allow('', null),
    line3: Joi.string().allow('', null),
    locality: Joi.string().required(),
    district: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    pincode: Joi.string().required(),
});

const contactSchema = Joi.object({
    id: Joi.string().optional(),
    phone: Joi.string().required(),
    category: Joi.string().allow('', null),
});

export const createBranchSchema = Joi.object({
    name: Joi.string().required(),
    gst: Joi.string().optional().allow('', null),
    email: Joi.string().email().optional().allow('', null),
    url: Joi.string().optional().allow('', null),
    googleMapUrl: Joi.string().optional().allow('', null),
    lat: Joi.number().optional().allow(null),
    lon: Joi.number().optional().allow(null),
    senderId: Joi.string().optional().allow('', null),
    address: addressSchema.optional(),
    contacts: Joi.array().items(contactSchema).optional(),
    manufacturer: Joi.array().items(Joi.string()).optional(),
    personInCharge: Joi.array().items(Joi.string()).optional(),
});

export const updateBranchSchema = Joi.object({
    name: Joi.string().optional(),
    gst: Joi.string().optional().allow('', null),
    email: Joi.string().email().optional().allow('', null),
    url: Joi.string().optional().allow('', null),
    googleMapUrl: Joi.string().optional().allow('', null),
    lat: Joi.number().optional().allow(null),
    lon: Joi.number().optional().allow(null),
    senderId: Joi.string().optional().allow('', null),
    address: addressSchema.optional(),
    contacts: Joi.array().items(contactSchema).optional(),
    manufacturer: Joi.array().items(Joi.string()).optional(),
    personInCharge: Joi.array().items(Joi.string()).optional(),
});
