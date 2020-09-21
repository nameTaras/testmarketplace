const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addProductSchema = new Schema({
	title: String,
	location: String,
	description: String,
	photos: String,
	price: String,
	ownerId: String
});

const likeProductSchema = new Schema({
	productId: String
});

const unlikeProductSchema = new Schema({
	productId: String
});

module.exports = {
	addProductSchema,
	likeProductSchema,
	unlikeProductSchema
};