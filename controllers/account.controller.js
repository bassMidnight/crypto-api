const {
  FindAllAccounts,
  FindAccountByPk,
  CreateAccount,
  UpdateAccount,
  DeleteAccount,
} = require("../services/account.service");
const { CreatePayment } = require("../services/payment.service");
const { CreateTransection } = require("../services/transection.service");

const dateFormat = require("../utils/dateFormat");

exports.GetAllAccounts = async (req, res) => {
  try {
    const search = req.query.search;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const accounts = await FindAllAccounts(search, offset, limit);
    console.log("accounts : ", accounts);

    if (!accounts)
      return res.status(500).json({ message: "Error finding accounts" });

    return res
      .status(200)
      .json({ message: "Account retrieved successfully", accounts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.GetAllAccountByUserID = async (req, res) => {
  try {
    const id = req.query.id;
    const accounts = await FindAccountByPk(id);
    if (!accounts)
      return res.status(500).json({ message: "Error finding accounts" });

    return res
      .status(200)
      .json({ message: "Account retrieved successfully", accounts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.CreateAccount = async (req, res) => {
  try {
    let createData = req.body;
    if (!createData.currencyId) createData.currencyId = null;
    if (!createData.fiatCurrencyId) createData.fiatCurrencyId = null;

    if (!createData.userId)
      return res.status(400).json({ message: "User id is required" });
    if (!createData.currencyId && !createData.fiatCurrencyId)
      return res
        .status(400)
        .json({ message: "Currency id or fiat currency id is required" });

    const account = await CreateAccount(createData);
    if (!account)
      return res.status(500).json({ message: "Error creating account" });

    return res
      .status(200)
      .json({ message: "Account created successfully", account });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.UpdateAccount = async (req, res) => {
  try {
    const { id, userId, currencyId, faitCurrencyId, balance } = req.body;

    const account = await UpdateAccount(id, {
      userId,
      currencyId,
      faitCurrencyId,
      balance,
    });
    if (!account)
      return res.status(500).json({ message: "Error updating account" });

    return res
      .status(200)
      .json({ message: "Account updated successfully", account });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.DeleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const account = await DeleteAccount(id);
    if (!account)
      return res.status(500).json({ message: "Error deleting account" });

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.DespositAccount = async (req, res) => {
  try {
    const id = req.body.id;
    const amount = req.body.amount || 0;

    if (!id) return res.status(400).json({ message: "Id is required" });
    if (!amount) return res.status(400).json({ message: "Amount is required" });

    const userAccount = await FindAccountByPk(id);
    if (!userAccount || userAccount == null)
      return res.status(500).json({ message: "Error finding account" });

    const updateData = {
      balance: Number(amount) + Number(userAccount.dataValues.balance),
    };
    if (updateData.balance < 0)
      return res.status(500).json({ message: "Insufficient balance" });

    const account = await UpdateAccount(id, updateData);
    if (!account)
      return res.status(500).json({ message: "Error updating account" });

    console.log("userAccount : ", userAccount.dataValues);

    const createTransactionData = {
      accountId: userAccount.id,
      amount,
      type: "DEPOSIT",
      balance: amount,
      currencyId:
        userAccount.dataValues.currencyId ||
        userAccount.dataValues.fiatCurrencyId,
    };

    await CreateTransection(createTransactionData);

    return res.status(200).json({ message: "Account updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.WithdrawAccount = async (req, res) => {
  try {
    const id = req.body.id;
    const amount = req.body.amount || 0;
    const paymentMethod = req.body.paymentMethod || null;

    if (!id) return res.status(400).json({ message: "Id is required" });
    if (!amount) return res.status(400).json({ message: "Amount is required" });
    if (!paymentMethod)
      return res.status(400).json({ message: "Payment method is required" });

    const userAccount = await FindAccountByPk(id);
    if (!userAccount || userAccount == null)
      return res.status(500).json({ message: "Error finding account" });

    let updateData = { balance: Number(userAccount.balance) - Number(amount) };
    if (updateData.balance < 0)
      return res.status(500).json({ message: "Insufficient balance" });

    const account = await UpdateAccount(id, updateData);
    if (!account)
      return res.status(500).json({ message: "Error updating account" });

    const createTransactionData = {
      accountId: userAccount.id,
      amount,
      type: "WITHDRAWAL",
      balance: amount,
      currencyId:
        userAccount.dataValues.currencyId ||
        userAccount.dataValues.fiatCurrencyId,
    };

    await CreateTransection(createTransactionData);

    return res
      .status(200)
      .json({ message: "Account updated successfully", account });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.TransferAccount = async (req, res) => {
  try {
    const id = req.body.id;
    const amount = req.body.amount || 0;
    const senderId = req.body.senderId || null;
    const receiverId = req.body.receiverId || null;

    if (!id) return res.status(400).json({ message: "Id is required" });
    if (!senderId || !receiverId)
      return res
        .status(400)
        .json({ message: "Sender or receiver id is required" });
    if (!amount) return res.status(400).json({ message: "Amount is required" });

    const senderAccount = await FindAccountByPk(senderId);
    if (!senderAccount || senderAccount == null)
      return res.status(500).json({ message: "Error finding sender account" });

    const receiverAccount = await FindAccountByPk(receiverId);
    if (!receiverAccount || receiverAccount == null)
      return res
        .status(500)
        .json({ message: "Error finding receiver account" });

    if (
      senderAccount.faitCurrencyId != senderAccount.faitCurrencyId ||
      receiverAccount.currencyId != receiverAccount.currencyId
    ) {
      return res
        .status(500)
        .json({
          message: "Sender and receiver accounts must be in the same currency",
        });
    }
    let updateSenderData = {
      balance: Number(senderAccount.balance) - Number(amount),
    };
    if (updateSenderData.balance < 0)
      return res.status(500).json({ message: "Insufficient balance" });

    const senderAccountUpdate = await UpdateAccount(senderId, updateSenderData);
    if (!senderAccountUpdate)
      return res.status(500).json({ message: "Error updating sender account" });

    let updateReceiverData = {
      balance: Number(receiverAccount.balance) + Number(amount),
    };

    const receiverAccountUpdate = await UpdateAccount(
      receiverId,
      updateReceiverData
    );
    if (!receiverAccountUpdate)
      return res
        .status(500)
        .json({ message: "Error updating receiver account" });

    const createTransactionData = {
      accountId: senderAccount.id,
      senderId,
      receiverId,
      amount,
      type: "TRANSFER",
      status: "COMPLETED",
      currencyId:
        senderAccount.dataValues.currencyId ||
        senderAccount.dataValues.fiatCurrencyId,
    };

    await CreateTransection(createTransactionData);

    return res
      .status(200)
      .json({
        message: "Account updated successfully",
        senderAccountUpdate,
        receiverAccountUpdate,
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
