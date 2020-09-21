const UserFactory = require("../factory/userFactory.js");

module.exports = function (router, passport) {
    router.post("/api/signUp", UserFactory.signUp);

    router.put("/api/editProfile", UserFactory.editProfile);

    router.get("/api/getUsers", UserFactory.getUsers);

    router.get("/api/getUser", UserFactory.getUser);

    router.get("/api/logout", UserFactory.logout);

    router.post("/api/logIn", passport.authenticate("local"), UserFactory.logIn);
}