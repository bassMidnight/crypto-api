const express = require("express");
// const { register, login } = require("../controllers/auth.controller");
const { GetAllUsers, approveKycUser } = require("../controllers/user.controller");
const router = express.Router();

router.get("/test", (req, res) => res.send("TEST USER ROUTING"));

router.get("/", GetAllUsers);
router.put("/approve/:id", approveKycUser);

module.exports = router;
