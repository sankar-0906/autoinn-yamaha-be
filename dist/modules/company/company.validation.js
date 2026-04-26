import Joi from 'joi';
export const createCompanySchema = Joi.object({
    name: Joi.string().required(),
    cin: Joi.string().optional().allow(null, ''),
    pan: Joi.string().optional().allow(null, ''),
    email: Joi.string().email().optional().allow(null, ''),
    logo: Joi.string().optional().allow(null, ''),
    website: Joi.string().optional().allow(null, ''),
    contactPerson: Joi.string().optional().allow(null, ''),
    phone: Joi.string().optional().allow(null, ''),
    addressId: Joi.string().optional().allow(null, ''),
});
export const updateCompanySchema = Joi.object({
    name: Joi.string().optional(),
    cin: Joi.string().optional().allow(null, ''),
    pan: Joi.string().optional().allow(null, ''),
    email: Joi.string().email().optional().allow(null, ''),
    logo: Joi.string().optional().allow(null, ''),
    website: Joi.string().optional().allow(null, ''),
    contactPerson: Joi.string().optional().allow(null, ''),
    phone: Joi.string().optional().allow(null, ''),
    addressId: Joi.string().optional().allow(null, ''),
});
