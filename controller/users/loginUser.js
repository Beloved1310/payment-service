const bcrypt = require("bcrypt");
const { KnexService } = require("../../services/query");
const { signJWT } = require("../../middleware/auth");
const loginValidate = require("../../validation/loginValidate");

module.exports = async (req, res) => {
  const { value, error } = loginValidate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });
  const { email, password } = value;

  const user = await await KnexService.findUser(email);
  if (!user.length)
    return res.status(400).send({ error: "username or password not found" });

  const validPassword = await bcrypt.compare(password, user[0].password);
  if (!validPassword)
    return res.status(400).send({ error: "username or password not found " });
  const token = signJWT(user[0].id, email);
  res.header("x-auth-token", token);
  const data = { email, token };
  return res.send({ message: "Login Successful", data });
};
