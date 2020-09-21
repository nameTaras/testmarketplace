const mongoose = require("mongoose");
const { google } = require('googleapis');
const Config = require("../../config/config.server.js");
const { AuthorizeAppToGoogleDrive } = require("../googleDriveApi/authorizeApp.js");
const appSchema = require("../validation/appValidation.js");

const { client_secret, client_id, redirect_uris } = Config.googleDriveCredentials;
const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
);

async function setGoogleDriveToken(req, res) {
    const SetGoogleDriveToken = 
        mongoose.model("setGoogleDriveToken", appSchema.setGoogleDriveTokenSchema);
    const code = new SetGoogleDriveToken({ code: req.query.code});

    let result = null;
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        google.options({ auth: oAuth2Client });

        result = AuthorizeAppToGoogleDrive(req.mongo, tokens, oAuth2Client);
    } catch (err) {
        console.log(err);
    }

    res.send(result);
}

module.exports = {
    setGoogleDriveToken
}