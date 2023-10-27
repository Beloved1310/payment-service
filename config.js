const dotenv = require("dotenv");

dotenv.config();
const { env } = process;

module.exports = {
  JWT: env.JWT_KEY,
  PORT: env.PORT || 8000,
  debug: env.debug,
  DB_HOST: env.DB_HOST,
  DB_USER: env.DB_USER,
  DB_PASSWORD: env.DB_PASSWORD,
  DB_PORT: env.DB_PORT,
  DB_NAME : env.DB_NAME,
  NODE_ENV: env.NODE_ENV
};
