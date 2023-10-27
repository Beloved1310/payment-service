/* eslint consistent-return: "off" */

const jwt = require("jsonwebtoken");
const { JWT } = require("../config");

const signJWT = (id, email) => {
  const jwtSignature = jwt.sign(
    {
      id,
      email,
    },
    JWT
  );
  return jwtSignature;
};
const authJWT = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send({ message: "Invalid token." });
  }
};
module.exports = { signJWT, authJWT };
