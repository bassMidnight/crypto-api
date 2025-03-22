const sequelize = require("../config/database");
const User = require("./user.model");
const Account = require("./account.model");
const Currency = require("./currency.model");
const FiatCurrency = require("./fiatCurrency.model");
const Payment = require("./payment.model");
const Transaction = require("./transaction.model");
const BuySellOrder = require("./buySellOrder.model");

// กำหนดความสัมพันธ์
User.hasMany(Account, { foreignKey: "userId" }); // User -> Account (หนึ่ง User มีหลาย Account)
Account.belongsTo(User, { foreignKey: "userId" }); // Account -> User (Account เชื่อมโยงกับ User)
Account.hasMany(Transaction, { foreignKey: "accountId" }); // Account -> Transaction (หนึ่ง Account มีหลาย Transaction)
Transaction.belongsTo(Account, { foreignKey: "accountId" }); // Transaction -> Account (Transaction เชื่อมโยงกับ Account)
User.hasMany(Transaction, { foreignKey: "senderId" }); // User -> Transaction (ส่งเงินออกจาก User)
Transaction.belongsTo(User, { foreignKey: "senderId" }); // Transaction -> User (Transaction เชื่อมโยงกับ User ส่งเงิน)
Transaction.belongsTo(User, { foreignKey: "receiverId" }); // Transaction -> User (เชื่อมโยงกับ User รับเงิน)
Transaction.belongsTo(Currency, { foreignKey: "currencyId" }); // Transaction -> Currency (Transaction เชื่อมโยงกับ Currency)
Currency.hasMany(Transaction, { foreignKey: "currencyId" }); // Currency -> Transaction (Currency มีหลาย Transaction)
Transaction.belongsTo(FiatCurrency, { foreignKey: "fiatCurrencyId" }); // Transaction -> FiatCurrency (Transaction เชื่อมโยงกับ FiatCurrency)
FiatCurrency.hasMany(Transaction, { foreignKey: "fiatCurrencyId" }); // FiatCurrency -> Transaction (FiatCurrency มีหลาย Transaction)
User.hasMany(Payment, { foreignKey: "userId" }); // User -> Payment (User มีหลาย Payment)
Payment.belongsTo(User, { foreignKey: "userId" }); // Payment -> User (Payment เชื่อมโยงกับ User)
Payment.belongsTo(FiatCurrency, { foreignKey: "fiatCurrencyId" }); // Payment -> FiatCurrency (Payment เชื่อมโยงกับ FiatCurrency)
BuySellOrder.belongsTo(User, { foreignKey: "userId" }); // BuySellOrder -> User (BuySellOrder เชื่อมโยงกับ User)
BuySellOrder.belongsTo(Currency, { foreignKey: "currencyId" }); // BuySellOrder -> Currency (BuySellOrder เชื่อมโยงกับ Currency)

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected...");
    
    // `force: true` จะล้างข้อมูลทั้งหมด
    await sequelize.sync({ force: false }); 
    console.log("Database synchronized...");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

module.exports = { sequelize, User, Account, Currency, FiatCurrency, Payment, Transaction, BuySellOrder, syncDatabase };
