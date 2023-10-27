const { KnexService } = require("../services/query");
const fundWalletValidate = require("../validation/fundWalletValidate");

module.exports = async (req, res) => {
  const { value, error } = fundWalletValidate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  const { amount } = value;
  const currentAccount = await KnexService.isExist(
    "email",
    req.user.email,
    "wallet"
  );

  if (currentAccount[0] < amount)
    return res
      .status(424)
      .send({ error: "Insuffient Fund to complete this transfer" });
  await KnexService.decrementWallet(req.user.email, amount);
  return res.send({
    message: `Withdrawal of  ${amount} naira successful`,
    data: {
      currentAcccount: currentAccount[0] - amount,
    },
  });
};
