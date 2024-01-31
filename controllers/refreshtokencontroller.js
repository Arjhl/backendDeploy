"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const User = require("../model/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const handleRefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    try {
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
            throw new Error("Refresh token not available");
        console.log(cookies.jwt);
        const refreshToken = cookies.jwt;
        const foundUser = yield User.find({ refreshToken }).exec();
        if (!foundUser)
            throw new Error("Refresh token is not valid");
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const accessToken = jwt.sign({
            email: foundUser.email,
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
        res.cookie("access", accessToken);
    }
    catch (err) {
        console.log(err);
    }
});
module.exports = { handleRefreshToken };
