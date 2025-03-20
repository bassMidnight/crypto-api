const express = require("express");
const { GetAllCurrencies, CreateCurrency, UpdateCurrency } = require("../controllers/currency.controller.js");
const router = express.Router();

router.get("/test", (req, res) => res.send("TEST CURRENCY ROUTING"));

router.get("/", GetAllCurrencies);
router.post("/", CreateCurrency);
router.put("/:id", UpdateCurrency);

module.exports = router;
