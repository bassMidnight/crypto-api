const sequelize = require("../config/database");
const User = require("./user.model");
const Account = require("./account.model");
const Currency = require("./currency.model");
const FiatCurrency = require("./fiatCurrency.model");
const Transaction = require("./transaction.model");
const BuySellOrder = require("./buySellOrder.model");

// กำหนดความสัมพันธ์
User.hasMany(Account, { foreignKey: "userId" }); // User -> Account (หนึ่ง User มีหลาย Account)
Account.belongsTo(User, { foreignKey: "userId" }); // Account -> User (Account เชื่อมโยงกับ User)
Account.hasMany(Transaction, { foreignKey: "accountId" }); // Account -> Transaction (หนึ่ง Account มีหลาย Transaction)
Transaction.belongsTo(Account, { foreignKey: "accountId" }); // Transaction -> Account (Transaction เชื่อมโยงกับ Account)
User.hasMany(Transaction, { foreignKey: "senderId" }); // User -> Transaction (ส่งเงินออกจาก User)
Transaction.belongsTo(Account, { foreignKey: "senderId" }); // Transaction -> Account (Transaction เชื่อมโยงกับ Account ส่งเงิน)
Transaction.belongsTo(Account, { foreignKey: "receiverId" }); // Transaction -> Account (เชื่อมโยงกับ Account รับเงิน)
Transaction.belongsTo(Currency, { foreignKey: "currencyId" }); // Transaction -> Currency (Transaction เชื่อมโยงกับ Currency)
Currency.hasMany(Transaction, { foreignKey: "currencyId" }); // Currency -> Transaction (Currency มีหลาย Transaction)
Transaction.belongsTo(FiatCurrency, { foreignKey: "fiatCurrencyId" }); // Transaction -> FiatCurrency (Transaction เชื่อมโยงกับ FiatCurrency)
FiatCurrency.hasMany(Transaction, { foreignKey: "fiatCurrencyId" }); // FiatCurrency -> Transaction (FiatCurrency มีหลาย Transaction)
BuySellOrder.belongsTo(Account, { foreignKey: "accountId" }); // BuySellOrder -> User (BuySellOrder เชื่อมโยงกับ User)
BuySellOrder.belongsTo(Currency, { foreignKey: "currencyId" }); // BuySellOrder -> Currency (BuySellOrder เชื่อมโยงกับ Currency)
BuySellOrder.belongsTo(FiatCurrency, { foreignKey: "fiatCurrencyId" }); // BuySellOrder -> FiatCurrency (BuySellOrder เชื่อมโยงกับ FiatCurrency)
Account.belongsTo(Currency, { foreignKey: "currencyId" }); // Account -> Currency (Account เชื่อมโยงกับ Currency)
Account.belongsTo(FiatCurrency, { foreignKey: "fiatCurrencyId" }); // Account -> FiatCurrency (Account เชื่อมโยงกับ FiatCurrency)

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected...");
    
    await sequelize.sync({ force: false }); 
    console.log("Database synchronized...");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

module.exports = { sequelize, User, Account, Currency, FiatCurrency, Transaction, BuySellOrder, syncDatabase };
