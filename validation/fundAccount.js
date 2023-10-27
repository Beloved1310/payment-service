const Joi = require("joi");

module.exports = function validate(input) {
  const schema = Joi.object({
    accountNumber: Joi.number().required(),
    amount: Joi.number().required(),
  });
  return schema.validate(input);
};
