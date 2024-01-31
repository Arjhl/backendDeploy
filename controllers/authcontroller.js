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
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/User");
const Contact = require("../model/Contacts");
const signupHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password } = req.body;
    console.log(email, username, password);
    const duplicate = yield User.findOne({ email: email }).exec();
    if (duplicate)
        return res.sendStatus(409);
    try {
        //encrypt the password
        const hashedPwd = yield bcrypt.hash(password, 10);
        //store the new user
        const newUser = yield User.create({
            email: email,
            username: username,
            password: hashedPwd,
        });
        const newContact = yield Contact.create({
            user_id: newUser._id,
            contacts: [],
        });
        console.log("new users and new contact", newUser, newContact);
        res.status(201).json({ success: `New user ${newUser.email} created!` });
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
});
const loginHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: "Email and Password are required" });
    const foundUser = yield User.findOne({ email }).exec();
    if (!foundUser)
        return res.sendStatus(401);
    //evaluate password
    const match = yield bcrypt.compare(password, foundUser.password);
    if (match) {
        //create JWTs
        const accessToken = jwt.sign({
            email: foundUser.email,
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
        // const resData = currentUser.id;
        console.log(accessToken);
        res.status(200).json({
            _id: foundUser._id,
            username: foundUser.username,
            access: accessToken,
        });
    }
    else {
        res.sendStatus(401);
    }
});
const logoutHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // res.send(JSON.stringify({req?.cookies.access, req?.cookies.jwt}));
    res.clearCookie("access");
    // res.clearCookie("jwt");
    res.end();
});
module.exports = {
    signupHandler,
    loginHandler,
    logoutHandler,
};
