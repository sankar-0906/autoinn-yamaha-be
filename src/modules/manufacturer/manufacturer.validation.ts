import Joi from 'joi';

export const createManufacturerSchema = Joi.object({
    name: Joi.string().required(),
    code: Joi.string().optional().allow(null, ''),
    email: Joi.string().email().required(),
    gst: Joi.string().required(),
    vehicleManufacturer: Joi.boolean().default(false),

    // Address fields
    line1: Joi.string().required(),
    line2: Joi.string().optional().allow(null, ''),
    line3: Joi.string().optional().allow(null, ''),
    locality: Joi.string().optional().allow(null, ''),
    cityId: Joi.string().optional().allow(null, ''),
    stateId: Joi.string().optional().allow(null, ''),
    countryId: Joi.string().optional().allow(null, ''),
    pincode: Joi.string().optional().allow(null, ''),
});

export const updateManufacturerSchema = Joi.object({
    name: Joi.string().optional(),
    code: Joi.string().optional().allow(null, ''),
    email: Joi.string().email().optional(),
    gst: Joi.string().optional(),
    vehicleManufacturer: Joi.boolean().optional(),

    // Address fields
    line1: Joi.string().optional(),
    line2: Joi.string().optional().allow(null, ''),
    line3: Joi.string().optional().allow(null, ''),
    locality: Joi.string().optional().allow(null, ''),
    cityId: Joi.string().optional().allow(null, ''),
    stateId: Joi.string().optional().allow(null, ''),
    countryId: Joi.string().optional().allow(null, ''),
    pincode: Joi.string().optional().allow(null, ''),
});
