const {
  GetAllTransections,
  GetTransectionsByAccountID,
  GetTransectionsByUserID,
  DeleteTransectionbyAccountID,
  DeleteTransectionbyUserID,
  DeleteAllTransections,
} = require("../services/transection.service");

const dateFormat = require("../utils/dateFormat");

exports.GetAllTransections = async (req, res) => {
  try {
    const status = req.query.status || "PENDING";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const transections = await GetAllTransections(status, offset, limit);
    
    if (!transections) throw new Error("Error retrieving transections");

    const result = transections.map((transection) => ({
      id: transection.id,
      accountId: transection.accountId,
      currencyId: transection.currencyId,
      currencyName: transection.Currency?.dataValues.name || null,
      currencySymbol: transection.Currency?.dataValues.symbol || null,
      fiatCurrencyId: transection.fiatCurrencyId,
      fiatCurrencyName: transection.FiatCurrency?.dataValues.name || null,
      fiatCurrencySymbol: transection.FiatCurrency?.dataValues.symbol || null,
      price: transection.price,
      quantity: transection.quantity,
      status: transection.status,
      orderType: transection.orderType,
      createdAt: dateFormat.convertTimestampToDateTime(transection.createdAt),
      updatedAt: dateFormat.convertTimestampToDateTime(transection.updatedAt),
    }))
    return res
      .status(200)
      .json({ message: "Transections retrieved successfully", result });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving transections", error : error.message });
  }
};

exports.GetTransectionsByAccountID = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transactions = await GetTransectionsByAccountID(id);
    if (!transactions)
      throw new Error("Error retrieving transactions by account id");
    
    const result = transactions.map((transection) => ({
      id: transection.id,
      accountId: transection.accountId,
      currencyId: transection.currencyId,
      currencyName: transection.Currency?.dataValues.name || null,
      currencySymbol: transection.Currency?.dataValues.symbol || null,
      fiatCurrencyId: transection.fiatCurrencyId,
      fiatCurrencyName: transection.FiatCurrency?.dataValues.name || null,
      fiatCurrencySymbol: transection.FiatCurrency?.dataValues.symbol || null,
      price: transection.price,
      quantity: transection.quantity,
      status: transection.status,
      orderType: transection.orderType,
      createdAt: dateFormat.convertTimestampToDateTime(transection.createdAt),
      updatedAt: dateFormat.convertTimestampToDateTime(transection.updatedAt),
    }))
    
    return res
      .status(200)
      .json({ message: "Transactions retrieved successfully", result });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving transactions by account id", error : error.message });
  }
};

exports.GetTransectionsByUserID = async (req, res) => {
  try {
    const { id } = req.params;
    const transactions = await GetTransectionsByUserID(id);
    if (!transactions)
      throw new Error("Error retrieving transactions by user id");

    const result = transactions.map((transection) => ({
      id: transection.id,
      accountId: transection.accountId,
      currencyId: transection.currencyId,
      currencyName: transection.Currency?.dataValues.name || null,
      currencySymbol: transection.Currency?.dataValues.symbol || null,
      fiatCurrencyId: transection.fiatCurrencyId,
      fiatCurrencyName: transection.FiatCurrency?.dataValues.name || null,
      fiatCurrencySymbol: transection.FiatCurrency?.dataValues.symbol || null,
      price: transection.price,
      quantity: transection.quantity,
      status: transection.status,
      orderType: transection.orderType,
      createdAt: dateFormat.convertTimestampToDateTime(transection.createdAt),
      updatedAt: dateFormat.convertTimestampToDateTime(transection.updatedAt),
    }))
    return res
      .status(200)
      .json({ message: "Transactions retrieved successfully", result });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving transactions by user id", error: message });
  }
};

exports.DeleteAllTransections = async (req, res) => {
  try {
    const transactions = await DeleteAllTransections();
    if (!transactions) throw new Error("Error deleting all transactions");

    return res
      .status(200)
      .json({ message: "Transactions deleted successfully", transactions });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting all transactions", error });
  }
};

exports.DeleteTransectionbyUserID = async (req, res) => {
  try {
    const { id } = req.params;
    const transactions = await DeleteTransectionbyUserID(id);
    if (!transactions)
      throw new Error("Error retrieving transactions by user id");

    return res
      .status(200)
      .json({ message: "Transactions retrieved successfully", transactions });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving transactions by user id", error });
  }
};

exports.DeleteTransectionbyAccountID = async (req, res) => {
  try {
    const { id } = req.params;
    const transactions = await DeleteTransectionbyAccountID(id);
    if (!transactions) throw new Error("Error deleting all transactions");

    return res
      .status(200)
      .json({ message: "Transactions deleted successfully", transactions });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting all transactions", error });
  }
};
