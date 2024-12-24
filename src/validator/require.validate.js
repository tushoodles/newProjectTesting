const Joi = require("joi");

class RequireValidator {

  validateMember(data) {
    const schema = Joi.object({
      name: Joi.string().required(),
      userId:Joi.string().required()   
    });
    return schema.validate(data);
  }
}

module.exports = RequireValidator;