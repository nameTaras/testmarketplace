const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const signUpSchema = new Schema({
	email: String,
	fullName: String,
	password: String
});

const restorePasswordSchema = new Schema({
	email: String,
	fullName: String,
	password: String,
	passwordAgain: String
});

const editProfileSchema = new Schema({
	fullName: String,
	phoneNumber: String,
	userPhoto: String
});

module.exports = { 
	signUpSchema,
	restorePasswordSchema,
	editProfileSchema
};