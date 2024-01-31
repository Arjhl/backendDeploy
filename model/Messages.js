"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// const mongoose = require("mongoose");
const messageSchema = new mongoose_1.default.Schema({
    participants: {
        type: Array,
        required: true,
    },
    messagelist: {
        type: Array,
        required: true,
    },
});
module.exports = mongoose_1.default.model("Message", messageSchema);
