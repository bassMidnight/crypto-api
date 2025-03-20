const express = require("express");
const { GetAllAccounts, GetAllAccountsByUserID, CreateAccount, UpdateAccount } = require("../controllers/account.controller");
const router = express.Router();

router.get("/test", (req, res) => res.send("TEST ACCOUNT ROUTING"));

router.get("/", GetAllAccounts);
router.get("/user/:id", GetAllAccountsByUserID);

router.post("/", CreateAccount);
router.put("/:id", UpdateAccount);


module.exports = router;
