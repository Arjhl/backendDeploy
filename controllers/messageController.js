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
exports.updateMessage = exports.putMessages = exports.getMessgaes = void 0;
const Contact = require("../model/Contacts");
const Message = require("../model/Messages");
function getMessgaes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const messageId = req.query.messageId;
        try {
            const response = yield Message.findOne({ _id: messageId }).exec();
            res.send(response);
        }
        catch (err) {
            res.send(err);
        }
    });
}
exports.getMessgaes = getMessgaes;
function putMessages(msg, msgid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const msgObj = yield Message.findOne({ _id: msgid }).exec();
            const [p1, p2] = msgObj.participants;
            yield Contact.findOneAndUpdate({
                user_id: p1,
                "contactList.recieverId": p2,
            }, {
                $set: {
                    "contactList.$.lastMessage": msg.message,
                    "contactList.$.timeStamp": msg.timeStamp,
                },
            }, { new: true }).exec();
            yield Contact.findOneAndUpdate({
                user_id: p2,
                "contactList.recieverId": p1,
            }, {
                $set: {
                    "contactList.$.lastMessage": msg.message,
                    "contactList.$.timeStamp": msg.timeStamp,
                },
            }, { new: true }).exec();
            yield msgObj.messagelist.push(msg);
            msgObj.save();
        }
        catch (err) {
            return err;
        }
    });
}
exports.putMessages = putMessages;
function updateMessage(wsMsg, connections) {
    return __awaiter(this, void 0, void 0, function* () {
        // const msgid = req.body.messageId;
        // console.log("req msgid", req.body);
        // const msgObjId = req.body.msgid;
        const msgid = wsMsg.messageId;
        const msgObjId = wsMsg.msgid;
        const receiver_id = connections[wsMsg.receiver_id.toString()];
        const sender_id = connections[wsMsg.sender_id.toString()];
        // get receiver id and the emit connections[receiverid].send(update)
        try {
            const updatedMessages = yield Message.findOneAndUpdate({
                _id: msgObjId,
                "messagelist.messageid": msgid,
            }, { $set: { "messagelist.$.read": true } }, { new: true }).exec();
            if (receiver_id) {
                receiver_id.send(JSON.stringify(updatedMessages));
            }
            if (sender_id) {
                sender_id.send(JSON.stringify(updatedMessages));
            }
            // msgObj.messagelist.forEach(async (e: any, i: any) => {
            //   if (e.messageid === msgid) {
            // console.log(e, msgObj.messagelist[i]);
            // msgObj.messagelist[i].read = true;
            // await msgObj.save();
            // const newArr = msgObj.messagelist[i];
            // newArr.read = true;
            // const filtered = msgObj.messagelist.filter(
            //   (m: any) => m.messageid !== msgid
            // );
            // const update = { messagelist: [...filtered, newArr].sort() };
            // connections[receiver_id]?.send(
            //   JSON.stringify({ update: update, status: true })
            // );
            // await Message.findOneAndUpdate({ _id: msgObjId }, update);
            // }
            // });
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.updateMessage = updateMessage;
