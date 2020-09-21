const LocalStrategy = require('passport-local').Strategy
const bcrypt = require("bcrypt");
const ObjectId = require("mongodb").ObjectID;

module.exports = function (app, passport) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy({
        usernameField: "email",
        passReqToCallback: true
    },
        async (req, email, password, done) => {
            const db = req.mongo.db("marketplaceApp");
            const usersCollection = db.collection("users");
            let user = null;

            try {
                user = await usersCollection.findOne(
                    { email: email },
                    { projection: { userPhoto: 0 } }
                );
                if (!user) return done(null, false, { message: "incorrect email" });
            } catch (err) {
                done(err);
            }

            bcrypt.compare(password, user.password, (err, isValid) => {
                if (err) return done(err);

                if (!isValid) return done(null, false, { message: "incorrect password" });

                delete user.password;
                return done(null, user);
            });
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (req, id, done) => {
        const db = req.mongo.db("marketplaceApp");
        const usersCollection = db.collection("users");

        try {
            const user = await usersCollection.findOne(
                { _id: ObjectId(id) },
                { projection: { userPhoto: 0, password: 0 } }
                );
            done(null, user);
        } catch (err) {
            console.log(err);
        }
    });
}