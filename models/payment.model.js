const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user.model");
const FiatCurrency = require("./fiatCurrency.model");

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      references: { model: User, key: "id" },
      allowNull: false,
    },
    fiatCurrencyId: {
      type: DataTypes.UUID,
      references: { model: FiatCurrency, key: "id" },
      allowNull: false,
    },
    amount: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
    paymentMethod: {
      type: DataTypes.ENUM("BANK_TRANSFER", "CREDIT_CARD", "CRYPTO_TRANSFER"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "COMPLETED", "FAILED"),
      defaultValue: "PENDING",
    },
  },
  { 
    timestamps: true,
    paranoid: true
   }
);

module.exports = Payment;
