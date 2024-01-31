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
exports.updateGroup = exports.createGroup = exports.addContact = exports.getContacts = void 0;
const Contact = require("../model/Contacts");
const Message = require("../model/Messages");
function getContacts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.query.userId;
        try {
            const response = yield Contact.findOne({ user_id: userId }).exec();
            //sort and send contact list
            res.send(response);
        }
        catch (err) {
            res.send(err);
        }
    });
}
exports.getContacts = getContacts;
function addContact(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //new contact and message objec should be created
        const { senderName, receiverName, senderId, receiverId } = req.body;
        try {
            const senderContact = yield Contact.findOne({ user_id: senderId }).exec();
            const receiverContact = yield Contact.findOne({
                user_id: receiverId,
            }).exec();
            if (!receiverContact) {
                res.status(403).send("Contact not found");
            }
            const dup = senderContact.contactList.filter((contact) => contact.recieverId === receiverId)[0];
            if (dup) {
                return res.status(409).send("Contact already exists");
            }
            const newMessageCollection = yield Message.create({
                messageList: [],
                participants: [senderId, receiverId],
            });
            senderContact.contactList.push({
                name: receiverName,
                recieverId: receiverId,
                msgObject_id: newMessageCollection._id,
                lastMessage: "",
                timeStamp: Date.now(),
            });
            yield senderContact.save();
            receiverContact.contactList.push({
                name: senderName,
                recieverId: senderId,
                msgObject_id: newMessageCollection._id,
                lastMessage: "",
                timeStamp: Date.now(),
            });
            yield receiverContact.save();
            return res.status(200).send("New contact added successfully");
        }
        catch (err) {
            res.status(401);
        }
    });
}
exports.addContact = addContact;
function createGroup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const participantsList = req.body.participants;
        const groupName = req.body.groupName;
        if (!groupName)
            return res.send("Group name is required");
        try {
            const newMessageCollection = yield Message.create({
                messageList: [],
                participants: participantsList,
                groupName: groupName,
            });
            participantsList.map((p) => __awaiter(this, void 0, void 0, function* () {
                const contact = yield Contact.findOne({ user_id: p }).exec();
                contact.contacts.push({
                    participants: participantsList,
                    msgObject_id: newMessageCollection._id,
                });
                yield contact.save();
            }));
            res.send("New contact added successfully");
        }
        catch (err) {
            res.status(401);
        }
    });
}
exports.createGroup = createGroup;
function updateGroup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //find contact and make changes , this is for adding people to the group
        const messageCollectionId = req.params.messageId;
        const newParticipantsList = req.body.participants;
        newParticipantsList.map((participant) => __awaiter(this, void 0, void 0, function* () {
            const contactTobeMutated = yield Contact.findOne({
                user_id: participant,
            }).exec();
            const newContact = contactTobeMutated.contacts.filter((c) => c.MsgObject_id !== messageCollectionId)[0];
            newContact.participants = newParticipantsList;
            const filteredContacts = contactTobeMutated.contacts.filter((c) => c.MsgObject_id !== messageCollectionId);
            contactTobeMutated.contacts = [...filteredContacts, newContact];
        }));
    });
}
exports.updateGroup = updateGroup;
