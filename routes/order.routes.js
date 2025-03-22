const express = require("express");
const { GetAllOrders, CreateBuyOrder, CreateSellOrder, GetAllOrdersByUserID, CancleOrder, matchOrders} = require("../controllers/order.controller.js");
const router = express.Router();

router.get("/test", (req, res) => res.send("TEST AUTH ROUTING"));

router.get("/", GetAllOrders);
router.get("/user/:userId", GetAllOrdersByUserID);
router.post("/sell/", CreateSellOrder);
router.post("/buy/", CreateBuyOrder);
router.put("/:id/cancel/", CancleOrder);


router.post("/match/", matchOrders)

// router.get("/order/matchable", GetMatchableOrders);

module.exports = router;
