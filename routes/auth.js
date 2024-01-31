"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { signupHandler, loginHandler, logoutHandler, } = require("../controllers/authcontroller");
const router = express_1.default.Router();
router.post("/signup", signupHandler);
router.post("/login", loginHandler);
router.post("/logout", logoutHandler);
module.exports = router;
