const express = require("express");
const { GetAllTransections, GetTransectionsByAccountID, GetTransectionsByUserID, DeleteAllTransections } = require("../controllers/transection.controller");
const { DeleteTransectionbyAccountID } = require("../services/transection.service");
const router = express.Router();

router.get("/test", (req, res) => res.send("TEST TRANSECTION ROUTING"));

router.get("/", GetAllTransections);
router.get("/user/:id", GetTransectionsByUserID);
router.get("/account/:id", GetTransectionsByAccountID);

router.delete("/", DeleteAllTransections)
router.delete("/account/:id", DeleteTransectionbyAccountID)
router.delete("/user/:id", DeleteAllTransections)

module.exports = router;
