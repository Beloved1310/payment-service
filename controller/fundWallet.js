const { KnexService } = require("../services/query");
const fundWalletValidate = require("../validation/fundWalletValidate");

module.exports = async (req, res) => {
  const { value, error } = fundWalletValidate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });
  const { amount } = value;

  const previousAccount = await KnexService.isExist(
    "email",
    req.user.email,
    "wallet"
  );

   await KnexService.incrementWallet(
    "email",
    req.user.email,
    "wallet",
    amount
  );

  return res.send({
    message: `Your account is successfully funded with ${amount} naira`,
    data: {
      currentAccount: previousAccount[0] + amount,
    },
  });
};
