const express = require("express");
const {
  GetAllAccounts,
  GetAllAccountByUserID,
  CreateAccount,
  UpdateAccount,
  DespositAccount,
  WithdrawAccount,
  DeleteAccount,
  TransferAccount,
} = require("../controllers/account.controller");
const router = express.Router();

router.get("/test", (req, res) => res.send("TEST ACCOUNT ROUTING"));

router.get("/", GetAllAccounts);
router.get("/user/:id", GetAllAccountByUserID);

router.post("/", CreateAccount);
router.put("/", UpdateAccount);
router.delete("/:id", DeleteAccount);

router.post("/deposit/", DespositAccount);
router.post("/withdraw/", WithdrawAccount);
router.post("transfer/", TransferAccount);

module.exports = router;
