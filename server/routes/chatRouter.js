const ChatFactory = require("../factory/chatFactory.js");

module.exports = function (router) {
    router.post("/api/createChat", ChatFactory.createChat);

    router.post("/api/createMessage", ChatFactory.createMessage);

    router.post("/api/readMessage", ChatFactory.readMessage);

    router.get("/api/getChats", ChatFactory.getChats);

    router.get("/api/getChat", ChatFactory.getChat);

    router.get("/api/unreadMessage", ChatFactory.unreadMessage);
}