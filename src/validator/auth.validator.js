const Joi = require('joi');

function validemail(object){
    return Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.email": "Provide a valid email for authenticity.",
                "any.required": "email is required.",
            })
    }).validate(object)
}

function validatelogin(object) {
    return Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.email": "Provide a valid email for authenticity.",
                "any.required": "email is required.",
            }), 
        password: Joi.string()
            .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
            .required()
            .messages({
                "string.pattern.base": "Inavalid password",
                "any.required": "Password is required.",
            }),
    }).validate(object);
}

module.exports = {
    validatelogin,
    validemail
}