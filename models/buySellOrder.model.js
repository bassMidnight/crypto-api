const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user.model");
const Currency = require("./currency.model");
const Account = require("./account.model");
const FiatCurrency = require("./fiatCurrency.model");

const BuySellOrder = sequelize.define(
  "BuySellOrder",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    accountId: {
      type: DataTypes.UUID,
      references: { model: Account, key: "id" },
      allowNull: false,
    },
    orderType: { type: DataTypes.ENUM("BUY", "SELL"), allowNull: false },
    price: { type: DataTypes.DECIMAL(18, 8), allowNull: false },
    quantity: { type: DataTypes.DECIMAL(18, 8), allowNull: false },
    status: {
      type: DataTypes.ENUM("PENDING", "COMPLETED", "CANCELLED"),
      defaultValue: "PENDING",
    },
    currencyId: { type: DataTypes.UUID, references: { model: Currency, key: "id" }, allowNull: false },
    fiatCurrencyId: { type: DataTypes.UUID, references: { model: FiatCurrency, key: "id" }, allowNull: false },
    totalAmount: { type: DataTypes.DECIMAL(18, 8), allowNull: false },
  },
  { 
    timestamps: true,
    paranoid: true
  }
);

module.exports = BuySellOrder;
