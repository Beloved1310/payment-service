const Joi = require("joi");

module.exports = function validate(input) {
  const schema = Joi.object({
    amount: Joi.number().required(),
  });
  return schema.validate(input);
};
