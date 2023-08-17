const Joi = require('joi');

const validators = {

    register: Joi.object({
            name: Joi.string().min(3).max(100).required(),
            email: Joi.string().min(3).email().required(), //.email() will check for the basic email syntax that includes the @ symbol
            password: Joi.string().min(6).required(), // considering if we should use joi-password npm package
        }),

    loginSchema: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    })

}

module.exports = validators
