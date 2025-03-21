const express = require("express");
const { GetAllAccounts, GetAllAccountByUserID, CreateAccount, UpdateAccount, DespositAccount, WithdrawAccount } = require("../controllers/account.controller");
const router = express.Router();

router.get("/test", (req, res) => res.send("TEST ACCOUNT ROUTING"));

router.get("/", GetAllAccounts);
router.get("/user/:id", GetAllAccountByUserID);

router.post("/", CreateAccount);
router.put("/", UpdateAccount);

router.post("/deposit/", DespositAccount);
router.post("/withdraw/", WithdrawAccount);

module.exports = router;
