"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const { handleRefreshToken } = require("../controllers/refreshtokencontroller");
const verifyLogin = function (req, res, next) {
    // const accessToken = req.cookies.access;
    const accessToken = req.headers.authorization;
    console.log(accessToken, "accessToken is present in auth header");
    if (!accessToken)
        return res.status(403).json("No Cookie");
    try {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        next();
    }
    catch (err) {
        res.send("Not Authorized , Login again to resolve");
    }
};
const verifyWebsocketLogin = function (token) {
    console.log("sec token", token);
    const result = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(result);
    //sends error for the websocket upgradation , client has to resolve it by requesting the access token
};
module.exports = {
    verifyLogin,
    verifyWebsocketLogin,
};
