const { FindAllAccounts, FindAccountByPk, CreateAccount, UpdateAccount } = require("../services/account.service");
const { CreatePayment } = require("../services/payment.service");

const dateFormat = require("../utils/dateFormat");

exports.GetAllAccounts = async (req, res) => {
  try {
    const search = req.query.search;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const accounts = await FindAllAccounts(search, offset, limit);    
    console.log("accounts : ", accounts);
    
    if(!accounts) return res.status(500).json({ message: "Error finding accounts" });

    return res.status(200).json({ message: "Account retrieved successfully", accounts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.GetAllAccountByUserID = async (req, res) => {
  try {

    const id = req.query.id;
    const accounts = await FindAccountByPk(id);
    if(!accounts) return res.status(500).json({ message: "Error finding accounts" });

    return res.status(200).json({ message: "Account retrieved successfully", accounts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.CreateAccount = async (req, res) => {
  try {

    let createData = req.body;
    if(!createData.currencyId) createData.currencyId = null;
    if(!createData.fiatCurrencyId) createData.fiatCurrencyId = null;

    const account = await CreateAccount(createData);
    if(!account) return res.status(500).json({ message: "Error creating account" });

    return res.status(200).json({ message: "Account created successfully", account });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.UpdateAccount = async (req, res) => {
  try {
    
    const { id, userId, currencyId, faitCurrencyId, balance } = req.body;

    const account = await UpdateAccount(id, { userId, currencyId, faitCurrencyId, balance });
    if(!account) return res.status(500).json({ message: "Error updating account" });
    
    return res.status(200).json({ message: "Account updated successfully", account });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.DespositAccount = async (req, res) => {
  try {
    
    const id = req.body.id;
    const amount = req.body.amount || 0;
    const paymentMethod = req.body.paymentMethod || null;

    if(!id) return res.status(400).json({ message: "Id is required" });
    if(!amount) return res.status(400).json({ message: "Amount is required" });
    if (!paymentMethod) return res.status(400).json({ message: "Payment method is required" });

    const userAccount = await FindAccountByPk(id)
    if(!userAccount || userAccount == null) return res.status(500).json({ message: "Error finding account" });
    
    const updateData = { balance: Number(amount) + Number(userAccount.dataValues.balance) }
    if(updateData.balance < 0) return res.status(500).json({ message: "Insufficient balance" });

    const account = await UpdateAccount(id, updateData);
    if(!account) return res.status(500).json({ message: "Error updating account" });

    await CreatePayment({
      userId : userAccount.userId,
      fiatCurrencyId : userAccount.fiatCurrencyId,
      amount : amount,
      paymentMethod : paymentMethod,
      status : "Desposit"
    })
    
    return res.status(200).json({ message: "Account updated successfully" });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.WithdrawAccount = async (req, res) => {
  try {
    
    const id = req.body.id;
    const amount = req.body.amount || 0;
    const paymentMethod = req.body.paymentMethod || null;

    if(!id) return res.status(400).json({ message: "Id is required" });
    if(!amount) return res.status(400).json({ message: "Amount is required" });
    if (!paymentMethod) return res.status(400).json({ message: "Payment method is required" });

    const userAccount = await FindAccountByPk(id)
    if(!userAccount || userAccount == null) return res.status(500).json({ message: "Error finding account" });

    let updateData = { balance: Number(userAccount.balance) - Number(amount) }
    if(updateData.balance < 0) return res.status(500).json({ message: "Insufficient balance" });

    const account = await UpdateAccount(id, updateData);
    if(!account) return res.status(500).json({ message: "Error updating account" });

    await CreatePayment({
      userId : userAccount.userId,
      fiatCurrencyId : userAccount.fiatCurrencyId,
      amount : amount,
      paymentMethod : paymentMethod,
      status : "Withdraw"
    })

    return res.status(200).json({ message: "Account updated successfully", account });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}