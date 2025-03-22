const express = require("express");
const { GetAllCurrencies, CreateCurrency, UpdateCurrency, DeleteCurrency } = require("../controllers/currency.controller.js");
const router = express.Router();

router.get("/test", (req, res) => res.send("TEST CURRENCY ROUTING"));

router.get("/", GetAllCurrencies);
router.post("/", CreateCurrency);
router.put("/:id", UpdateCurrency);
router.delete("/:id", DeleteCurrency)

module.exports = router;
