const express = require("express");
const { GetAllFiatCurrencies, CreateFiatCurrency, UpdateFiatCurrency, DeleteFiatCurrency } = require("../controllers/fiatcurrency.controller.js");
const router = express.Router();

router.get("/test", (req, res) => res.send("TEST FIATCURRENCY ROUTING"));

router.get("/", GetAllFiatCurrencies);
router.post("/", CreateFiatCurrency);
router.put("/:id", UpdateFiatCurrency);
router.delete("/:id", DeleteFiatCurrency);

module.exports = router;
