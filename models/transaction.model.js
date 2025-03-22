const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user.model");
const Account = require("./account.model");
const FiatCurrency = require("./fiatCurrency.model");
const Currency = require("./currency.model");

const Transaction = sequelize.define(
  "Transaction",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.UUID,
      references: { model: Account, key: "id" },
      allowNull: true,
    },
    receiverId: {
      type: DataTypes.UUID,
      references: { model: Account, key: "id" },
      allowNull: true,
    },
    accountId: {
      type: DataTypes.UUID,
      references: { model: Account, key: "id" },
      allowNull: false,
    },
    amount: { type: DataTypes.DECIMAL(18, 8), allowNull: true },
    price: { type: DataTypes.DECIMAL(18, 8), allowNull: true },
    totalAmount: { type: DataTypes.DECIMAL(18, 8), allowNull: true },
    type: {
      type: DataTypes.ENUM("DEPOSIT", "WITHDRAWAL", "TRANSFER", "TRADE"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "COMPLETED", "FAILED"),
      defaultValue: "PENDING",
    },
    fiatCurrencyId: {
      type: DataTypes.UUID,
      references: { model: FiatCurrency, key: "id" },
      allowNull: true,
    },
    currencyId: {
      type: DataTypes.UUID,
      references: { model: Currency, key: "id" },
      allowNull: true,
    },
  },
  { 
    timestamps: true,
    paranoid: true
  }
);

module.exports = Transaction;
