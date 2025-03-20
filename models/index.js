const sequelize = require("../config/database");
const User = require("./user.model");

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

module.exports = { sequelize, User, syncDatabase };
