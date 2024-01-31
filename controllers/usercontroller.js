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
exports.getUserUsingEmail = exports.getUser = void 0;
const User = require("../model/User");
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.query.userid;
        try {
            const response = yield User.findOne({ _id: userId }).exec();
            res.send(response);
        }
        catch (err) {
            res.status(403).send("Contact not found or wrong credentials");
        }
    });
}
exports.getUser = getUser;
function getUserUsingEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = req.query.emailId;
        try {
            const response = yield User.findOne({ email: email }).exec();
            if (!response)
                throw new Error("Contact not found or wrong credentials");
            res.send(response);
        }
        catch (err) {
            res.status(403).send("Contact not found or wrong credentials");
        }
    });
}
exports.getUserUsingEmail = getUserUsingEmail;
