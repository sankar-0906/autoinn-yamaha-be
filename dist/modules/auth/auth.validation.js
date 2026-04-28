import Joi from 'joi';
export const loginSchema = Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required()
});
export const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phone: Joi.string().required(),
    name: Joi.string().required()
});
