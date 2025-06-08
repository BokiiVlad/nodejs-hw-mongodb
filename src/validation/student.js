import Joi from 'joi';

export const contactSchemaValidate = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    phoneNumber: Joi.string()
        .pattern(/^[0-9+\-\s()]{7,20}$/)
        .min(7)
        .max(20)
        .required(),
    email: Joi.string().email().min(3).max(20).required(),
    isFavorite: Joi.boolean().default(false),
    contactType: Joi.string().min(3).max(20).valid('work', 'home', 'personal'),
});