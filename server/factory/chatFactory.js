const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;

const chatsSchema = require("../validation/chatValidation.js");

async function createChat(req, res) {
    const CreateChat = mongoose.model("CreateChat", chatsSchema.createChatSchema);
    const db = req.mongo.db("marketplaceApp");
    const chatsCollection = db.collection("chats");
    const { productId, productOwner } = req.body;
    const authorId = req.user._id.toString();

    let chat = null;
    try {
        chat = await chatsCollection.findOne({ productId });
    } catch (err) {
        console.log(err);
    }

    if (chat) {
        res.send("Chat already exists");
    } else {
        let createdChat = null;
        try {
            createdChat = await chatsCollection.insertOne(new CreateChat({
                productId,
                members: [authorId, productOwner],
                messages: []
            }));

            res.send(createdChat.ops);
        } catch (err) {
            console.log(err);
        }
    }
}

async function createMessage(req, res) {
    const CreateMessage = mongoose.model("CreateMessage", chatsSchema.createMessageSchema);
    const db = req.mongo.db("marketplaceApp");
    const chatsCollection = db.collection("chats");
    const { message, date, productId } = new CreateMessage(req.body);
    const authorId = req.user._id && req.user._id.toString();
    const messageData = { authorId, message, date, unreadMessage: true };

    try {
        const chat = await chatsCollection.findOneAndUpdate(
            {
                productId
            },
            {
                $push: {
                    messages: {
                        $each: [messageData],
                        $position: 0
                    }
                }
            }
        );

        res.send({
            message: messageData,
            chatId: chat.value._id,
        });
    } catch (err) {
        console.log(err);
    }
}

async function readMessage(req, res) {
    const db = req.mongo.db("marketplaceApp");
    const chatsCollection = db.collection("chats");
    const authorId = req.user._id && req.user._id.toString();
    const { chatId } = req.body;

    try {
        const chat = await chatsCollection.findOneAndUpdate(
            {
                "_id": ObjectId(chatId)
            },
            {
                $set: {
                    "messages.$[element].unreadMessage": false
                }
            },
            {
                arrayFilters: [
                    {
                        "element.authorId": { $ne: authorId }
                    }
                ],
                returnOriginal: false
            }
        );

        res.send({ chat: chat.value });
    } catch (err) {
        console.log(err);
    }
}

async function getChats(req, res) {
    const db = req.mongo.db("marketplaceApp");
    const chatsCollection = db.collection("chats");
    const authorId = req.user._id.toString();

    try {
        const cursor = await chatsCollection.find(
            {
                members: { $all: [authorId] }
            }
        );

        const chats = await cursor.toArray();
        res.send(chats);
    } catch (err) {
        console.log(err);
    }
}

async function getChat(req, res) {
    const db = req.mongo.db("marketplaceApp");
    const chatsCollection = db.collection("chats");
    const authorId = req.user._id && req.user._id.toString();
    const { chatId } = req.query;

    try {
        const chat = await chatsCollection.findOne(
            {
                "_id": ObjectId(chatId),
                members: { $all: [authorId] }
            }
        );

        res.send({ chat });
    } catch (err) {
        console.log(err);
    }
}

async function unreadMessage(req, res) {
    const db = req.mongo.db("marketplaceApp");
    const chatsCollection = db.collection("chats");
    const authorId = req.user._id && req.user._id.toString();

    try {
        const cursor = await chatsCollection.find(
            {
                messages: {
                    $elemMatch: {
                        unreadMessage: true,
                        authorId: { $ne: authorId }
                    }
                },
                members: { $all: [authorId] }
            }
        );

        const chats = await cursor.toArray();
        res.send(chats);
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    createChat,
    readMessage,
    createMessage,
    getChats,
    getChat,
    unreadMessage
}