import Joi from 'joi';

export const contactSchemaValidete = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    phoneNumber: Joi.number().min(9).max(18),
    email: Joi.string().email().min(3).max(20).required(),
    isFavourite: Joi.boolean().default(false),
    contactType: Joi.string().min(3).max(20).valid('work', 'home', 'personal'),
});