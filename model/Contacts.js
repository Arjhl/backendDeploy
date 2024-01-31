"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
//contact array = [{name , lastmessage  , msgObject_id , timestamp}]
const contactSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongodb_1.ObjectId,
        required: true,
    },
    contactList: {
        type: Array,
        required: true,
    },
});
module.exports = mongoose_1.default.model("Contact", contactSchema);
