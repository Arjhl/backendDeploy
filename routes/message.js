"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// get messages using message id
const express_1 = require("express");
const messageController_1 = require("../controllers/messageController");
const router = (0, express_1.Router)();
router.get("/", messageController_1.getMessgaes);
router.post("/", messageController_1.updateMessage);
module.exports = router;
