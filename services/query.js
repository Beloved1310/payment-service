const { knex } = require("../db/db");

const KnexService = {
  findUser: (email) => {
    const existedUser = knex("users")
      .select("*")
      .where("email", email)
      .limit(1);

    return existedUser;
  },

  insert: (key, value) => {
    const newUser = knex(key).insert(value);
    return newUser;
  },

  incrementWallet: (key, value, incrementKey, incrementValue) => {
    const addWallet = knex("users")
      .where(key, value)
      .limit(1)
      .increment(incrementKey, incrementValue);
    return addWallet;
  },

  decrementWallet: (email, amount) => {
    const removeWallet = knex("users")
      .where("email", email)
      .limit(1)
      .decrement("wallet", amount);

    return removeWallet;
  },

  isExist: (key, value, ispluck) => {
    const isexist = knex("users")
      .select("*")
      .where(key, value)
      .limit(1)
      .pluck(ispluck);

    return isexist;
  },
};

module.exports = { KnexService };
