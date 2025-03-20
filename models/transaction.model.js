const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user.model");
const Account = require("./account.model");

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
      references: { model: User, key: "id" },
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.UUID,
      references: { model: User, key: "id" },
      allowNull: true,
    },
    accountId: {
      type: DataTypes.UUID,
      references: { model: Account, key: "id" },
      allowNull: false,
    },
    amount: { type: DataTypes.DECIMAL(18, 8), allowNull: false },
    type: {
      type: DataTypes.ENUM("DEPOSIT", "WITHDRAWAL", "TRANSFER", "TRADE"),
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

module.exports = Transaction;
