const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user.model");
const Currency = require("./currency.model");
const FiatCurrency = require("./fiatCurrency.model");

const Account = sequelize.define(
  "Account",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    currencyId: {
      type: DataTypes.UUID,
      references: { model: Currency, key: "id" },
      allowNull: true,
    },
    fiatCurrencyId: {
      type: DataTypes.UUID,
      references: { model: FiatCurrency, key: "id" },
      allowNull: true,
    },
    balance: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: false,
      defaultValue: 0,
    },
  },
  { 
    timestamps: true,
    paranoid: true
  }
);

module.exports = Account;
