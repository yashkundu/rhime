import Joi from 'joi'

export const userProfileSchema = Joi.object({
    firstName: Joi.string().required().trim().min(2).max(25).pattern(/^[a-zA-Z]+$/).lowercase(),
    lastName: Joi.string().allow('').trim().min(1).max(25).pattern(/^[a-zA-Z]*$/).lowercase(),
    bio: Joi.string().allow('').min(1).max(150),
    age: Joi.number().integer().min(11).max(100),
    gender: Joi.string().allow('').valid('male', 'female')
})