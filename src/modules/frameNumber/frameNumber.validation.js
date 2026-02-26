import Joi from 'joi';
export const createFrameNumberSchema = Joi.object({
    manufacturerId: Joi.string().required(),
    position: Joi.number().required(),
    inputValue: Joi.string().required(),
    inferredField: Joi.string().required(),
    targetValue: Joi.string().required()
});
export const updateFrameNumberSchema = Joi.object({
    manufacturerId: Joi.string().optional(),
    position: Joi.number().optional(),
    inputValue: Joi.string().optional(),
    inferredField: Joi.string().optional(),
    targetValue: Joi.string().optional()
});
//# sourceMappingURL=frameNumber.validation.js.map