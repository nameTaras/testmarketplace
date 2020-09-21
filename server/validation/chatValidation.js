const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const createChatSchema = new Schema({
	productId: String,
	messages: Array,
	members: Array
});

const createMessageSchema = new Schema({
	message: Object,
	productId: String,
	recipientId: String,
	date: String
});

module.exports = {
    createChatSchema,
    createMessageSchema
};