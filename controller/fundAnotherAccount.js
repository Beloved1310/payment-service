const { KnexService } = require("../services/query");
const fundAccount = require("../validation/fundAccount");

module.exports = async (req, res) => {
  const { value, error } = fundAccount(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  const { accountNumber, amount } = value;
  const existedAccount = await KnexService.isExist(
    "account",
    value.accountNumber,
    "account"
  );

  if (!existedAccount.length)
    return res.status(400).send({ error: "Invalid Account" });
  const debitWallet = await KnexService.isExist(
    "email",
    req.user.email,
    "wallet"
  );

  if (!debitWallet.length) {
    return res.status(400).send({ message: "Invalid wallet address" });
  }
  if (debitWallet[0] < amount)
    return res
      .status(424)
      .send({ error: "Insuffient Fund to complete this transfer" });
  await KnexService.decrementWallet(req.user.email);

  await KnexService.incrementWallet(
    "account",
    accountNumber,
    "wallet",
    value.amount
  );

  const transactionHistory = {
    previousAmount: debitWallet[0],
    currentAmount: debitWallet[0] - amount,
    userid: req.user.id,
  };

  await KnexService.insert("transactionHistory", transactionHistory);

  return res.send({
    message: `User account - ${accountNumber} is funded with ${amount} naira`,
    data: {
      currentAccount: debitWallet[0] - amount,
    },
  });
};
