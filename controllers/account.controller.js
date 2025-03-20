const { FindAllAccounts, CreateAccount } = require("../services/account.service");

const dateFormat = require("../utils/dateFormat");

exports.GetAllAccounts = async (req, res) => {
  try {
    const { search, page, size } = req.query;
    const offset = (page - 1) * size;

    const accounts = await FindAllAccounts(search, offset, Number(size));
    if(!accounts) return res.status(500).json({ message: "Error finding accounts" });

    return res.status(200).json({ message: "Account retrieved successfully", accounts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.GetAllAccountsByUserID = async (req, res) => {
  try {
    const { search, page, size } = req.query;
    const offset = (page - 1) * size;

    const accounts = await FindAllAccounts(search, offset, Number(size));
    if(!accounts) return res.status(500).json({ message: "Error finding accounts" });

    return res.status(200).json({ message: "Account retrieved successfully", accounts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.CreateAccount = async (req, res) => {
  try {
    // const {
    //   userId,
    //   currencyId,
    //   faitCurrencyId,
    //   balance,
    // } = req.body;

    const createData = req.body;
    const account = await CreateAccount(createData);
    if(!account) return res.status(500).json({ message: "Error creating account" });

    return res.status(200).json({ message: "Account created successfully", account });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.UpdateAccount = async (req, res) => {
  try {
    
    const { id } = req.params;
    const { userId, currencyId, faitCurrencyId, balance } = req.body;

    const account = await UpdateAccount(id, { userId, currencyId, faitCurrencyId, balance });
    if(!account) return res.status(500).json({ message: "Error updating account" });
    
    return res.status(200).json({ message: "Account updated successfully", account });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}