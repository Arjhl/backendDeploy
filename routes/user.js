"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usercontroller_1 = require("../controllers/usercontroller");
//get user
const router = (0, express_1.Router)();
router.get("/", usercontroller_1.getUser);
router.get("/email", usercontroller_1.getUserUsingEmail);
module.exports = router;
