const AppFactory = require("../factory/appFactory.js");

module.exports = function (router) {
    router.get("/api/setGoogleDriveToken", AppFactory.setGoogleDriveToken);
}