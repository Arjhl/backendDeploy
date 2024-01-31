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
exports.messageHandler = void 0;
const messageController_1 = require("../controllers/messageController");
const Contact = require("../model/Contacts");
// messagestatus = msgobjid ,messageid , messageStatus , userid(to know who read it)
const messageHandler = (message, connections) => {
    //message  = msgObj + msgid
    // console.log("message value", JSON.parse(message.toString()));
    const receivedMessage = JSON.parse(message.toString());
    //   connections["Arjun"].send("Hello");
    if (receivedMessage.status) {
        // update read status,updatemessagefunction should be called
        const rm = receivedMessage;
        (0, messageController_1.updateMessage)(rm, connections);
        return;
    }
    (0, messageController_1.putMessages)({
        sender: receivedMessage.sender,
        message: receivedMessage.message,
        sender_id: receivedMessage.sender_id,
        participants: receivedMessage.participants,
        timeStamp: receivedMessage.timeStamp,
        read: receivedMessage.read,
        messageid: receivedMessage.messageId,
    }, receivedMessage.msgid);
    receivedMessage.participants.forEach((p) => __awaiter(void 0, void 0, void 0, function* () {
        if (connections[p.toString()]) {
            const clientig = connections[p.toString()];
            clientig.send(JSON.stringify(receivedMessage));
        }
        // connections[p.toString()].send(JSON.stringify(receivedMessage));
    }));
    // connections["Arjun"]
};
exports.messageHandler = messageHandler;
