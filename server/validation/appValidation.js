const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const setGoogleDriveTokenSchema = new Schema({
	code: String
});

module.exports = {
    setGoogleDriveTokenSchema
};