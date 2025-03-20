const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user.model");
const Currency = require("./currency.model");

const BuySellOrder = sequelize.define(
  "BuySellOrder",
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
    currencyId: {
      type: DataTypes.UUID,
      references: { model: Currency, key: "id" },
      allowNull: false,
    },
    orderType: { type: DataTypes.ENUM("BUY", "SELL"), allowNull: false },
    price: { type: DataTypes.DECIMAL(18, 8), allowNull: false },
    quantity: { type: DataTypes.DECIMAL(18, 8), allowNull: false },
    status: {
      type: DataTypes.ENUM("PENDING", "COMPLETED", "CANCELLED"),
      defaultValue: "PENDING",
    },
  },
  { 
    timestamps: true,
    paranoid: true
  }
);

module.exports = BuySellOrder;
