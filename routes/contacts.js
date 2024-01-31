"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// get contacts using userid
const express_1 = require("express");
const contactcontroller_1 = require("../controllers/contactcontroller");
const router = (0, express_1.Router)();
router.get("/", contactcontroller_1.getContacts);
router.post("/", contactcontroller_1.createGroup);
router.post("/update", contactcontroller_1.updateGroup);
router.post("/add", contactcontroller_1.addContact);
module.exports = router;
