const { NODE_ENV }= require("../config");
const knexconfig = require("../knexfile")[NODE_ENV];
const knex = require("knex")(knexconfig);

module.exports = { knex };
