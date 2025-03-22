const express = require("express");
const { GetAllTransections, GetTransectionsByAccountID, GetTransectionsByUserID, DeleteAllTransections } = require("../controllers/transection.controller");
const router = express.Router();

router.get("/test", (req, res) => res.send("TEST TRANSECTION ROUTING"));

router.get("/", GetAllTransections);
router.get("/account/:id", GetTransectionsByAccountID);
router.get("/user/:id", GetTransectionsByUserID);

router.delete("/", DeleteAllTransections)
router.delete("/account/:id", GetTransectionsByAccountID)
router.delete("/user/:id", DeleteAllTransections)

module.exports = router;
