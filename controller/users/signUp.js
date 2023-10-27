const bcrypt = require("bcrypt");
const { KnexService } = require("../../services/query");
const signUpValidate = require("../../validation/signUpValidation");

module.exports = async (req, res) => {
  const { value, error } = signUpValidate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });
  const existedUser = await KnexService.findUser(value.email);
  if (existedUser && existedUser.length)
    return res.status(400).send({ error: "User already registered" });
  const salt = await bcrypt.genSalt(10);
  value.password = await bcrypt.hash(value.password, salt);
  value.account = Math.floor(Math.random() * 1000000000);

  await KnexService.insert("users", value);

  const data = { name: value.name, value: value.email };
  return res.send({
    message: "Your account is created, proceed to login",
    data,
  });
};
