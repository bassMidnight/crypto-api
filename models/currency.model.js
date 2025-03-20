const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Currency = sequelize.define(
  "Currency",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    symbol: { type: DataTypes.STRING, allowNull: false, unique: true }, // เช่น BTC, ETH
    name: { type: DataTypes.STRING, allowNull: false },
  },
  { 
    timestamps: false,
    paranoid: true
  }
);

module.exports = Currency;
