const {
  FindAllAccounts,
  FindAccountByPk,
  CreateAccount,
  UpdateAccount,
  DeleteAccount,
} = require("../services/account.service");
const { CreateTransection } = require("../services/transection.service");

const dateFormat = require("../utils/dateFormat");

exports.GetAllAccounts = async (req, res) => {
  try {
    const search = req.query.search;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const accounts = await FindAllAccounts(search, offset, limit);
    if (accounts == "No accounts found" ) {
      return res
      .status(200)
      .json({ message: "Account retrieved successfully", result: [] });
    }
    
    let result = accounts.map((account) => ({
      id: account.id,
      userId: account.userId,
      username: account.User?.dataValues.username || null,
      email: account.User?.dataValues.email || null,
      currencyId: account.currencyId,
      currencyName: account.Currency?.dataValues.name || null,
      currencySymbol: account.Currency?.dataValues.symbol || null,
      fiatCurrencyId: account.fiatCurrencyId,
      fiatCurrencyName: account.FiatCurrency?.dataValues.name || null,
      fiatCurrencySymbol: account.FiatCurrency?.dataValues.symbol || null,
      balance: account.balance,
      createdAt: dateFormat.convertTimestampToDateTime(account.createdAt),
      updatedAt: dateFormat.convertTimestampToDateTime(account.updatedAt),
    }));

    if (!accounts)
      return res.status(500).json({ message: "Error finding accounts" });

    return res
      .status(200)
      .json({ message: "Account retrieved successfully", result });
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

    // const alreadyAccount = await FindAccountByCurrencyOrFail(createData.currencyId, createData.fiatCurrencyId);

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
      .json({ message: "Account updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.DeleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

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
    
    const createTransactionData = {
      accountId: userAccount.id,
      amount,
      type: "COMPLETED",
      totalAmount: amount,
    };

    if(userAccount.currencyId) createTransactionData.currencyId = userAccount.currencyId;
    if(userAccount.faitCurrencyId) createTransactionData.faitCurrencyId = userAccount.faitCurrencyId;
    
    const transection = await CreateTransection(createTransactionData);
    if (!transection) return res.status(500).json({ message: "Error creating transection" });

    return res.status(200).json({ message: "Account updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.WithdrawAccount = async (req, res) => {
  try {
    const id = req.body.id;
    const amount = req.body.amount || 0;

    if (!id) return res.status(400).json({ message: "Id is required" });
    if (!amount) return res.status(400).json({ message: "Amount is required" });

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
      totalAmount: amount,
    };

    if(userAccount.currencyId) createTransactionData.currencyId = userAccount.currencyId;
    if(userAccount.faitCurrencyId) createTransactionData.faitCurrencyId = userAccount.faitCurrencyId;

    await CreateTransection(createTransactionData);

    return res
      .status(200)
      .json({ message: "Account updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.TransferAccount = async (req, res) => {
  try {
    const amount = req.body.amount || 0;
    const senderId = req.body.senderId || null;
    const receiverId = req.body.receiverId || null;

    if (!senderId || !receiverId)
      return res
        .status(400)
        .json({ message: "Sender or receiver id is required" });
    if (!amount) return res.status(400).json({ message: "Amount is required" });
    
    const senderAccount = await FindAccountByPk(senderId);
    if (!senderAccount || senderAccount == null)
      return res.status(500).json({ message: "Error finding sender account" });
    
    if (Number(senderAccount.balance) < Number(amount))
      return res.status(500).json({ message: "Insufficient balance" });
    
    const receiverAccount = await FindAccountByPk(receiverId);
    if (!receiverAccount || receiverAccount == null)
      return res
        .status(500)
        .json({ message: "Error finding receiver account" });

    if (
      senderAccount.faitCurrencyId != senderAccount.faitCurrencyId ||
      receiverAccount.currencyId != receiverAccount.currencyId
    ) {
      return res.status(500).json({
        message: "Sender and receiver accounts must be in the same currency",
      });
    }
    let updateSenderData = {
      balance: Number(senderAccount.balance) - Number(amount),
    };
    if (Number(updateSenderData.balance) < 0)
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
        
        console.log("err");
        
    const createTransactionData = {
      accountId: senderAccount.id,
      senderId,
      receiverId,
      totalAmount: amount,
      type: "TRANSFER",
      status: "COMPLETED",
    };

    if(senderAccount.currencyId) createTransactionData.currencyId = senderAccount.currencyId;
    if(senderAccount.faitCurrencyId) createTransactionData.faitCurrencyId = senderAccount.faitCurrencyId;
    
    const transaction = await CreateTransection(createTransactionData);
    if (!transaction)
      return res.status(500).json({ message: "Error creating transaction" });
    console.log("transection : ", transaction);
    
    
    return res.status(200).json({
      message: "Account updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
