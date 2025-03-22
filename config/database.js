const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, "", {
// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: true, // ปิด log query
  dialectOptions: {
    options: {
      allowPublicKeyRetrieval: true,  // อนุญาตให้ดึง public key
      ssl: {
        rejectUnauthorized: false // กำหนดการตรวจสอบ SSL
      }
    }
  }
});

module.exports = sequelize;
