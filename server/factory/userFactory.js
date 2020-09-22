const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const multiparty = require('multiparty');
const ObjectId = require("mongodb").ObjectID;
const GoogleDriveApi = require("../googleDriveApi/api.js");
const Config = require("../../config/config.server.js");
const { refreshToken } = require('../googleDriveApi/authorizeApp.js');

const usersSchema = require("../validation/userValidation.js");

async function signUp(req, res) {
	const SignUp = mongoose.model("SignUp", usersSchema.signUpSchema);
	const db = req.mongo.db("marketplaceApp");
	const usersCollection = db.collection("users");
	const likedCollection = db.collection("liked");
	const salt = bcrypt.genSaltSync(10);
	const newUser = { ...req.body, password: bcrypt.hashSync(req.body.password, salt) };
	let createdUser = null;

	try {
		createdUser = await usersCollection.insertOne(new SignUp(newUser));
	} catch (err) {
		console.log(err);
	}

	try {
		await likedCollection.insertOne({ userId: createdUser.insertedId.toString(), products: [] });
		res.send({ signed: true });
	} catch (err) {
		console.log(err);
	}
}

async function editProfile(req, res) {
	const EditProfile = mongoose.model("EditProfile", usersSchema.editProfileSchema);
	const db = req.mongo.db("marketplaceApp");
	const usersCollection = db.collection("users");
	const appCollection = db.collection("app");
	const userId = req.user._id.toString();
	const form = new multiparty.Form();

	let app = null;
	try {
		app = await appCollection.findOne({});
	} catch (err) {
		console.log(err);
	}

	let user = null;
	try {
		user = await new Promise((resolve, reject) => {
			form.parse(req, (err, fields, files) => {
				if (err) {
					reject(err);
				}
				resolve({ ...fields, ...files });
			})
		});
	} catch (err) {
		console.log(err);
	}

	for (let key in user) {
		user[key] = user[key][0];
	}

	if (user.userPhoto) {
		await refreshToken(appCollection);
		const oldUserPhoto = req.user.userPhoto;
		if (oldUserPhoto) {
			try {
				await GoogleDriveApi.deleteFile(oldUserPhoto);
			} catch (err) {
				console.log(err);
			}
		}

		try {
			const usersPhoto = 
                Config.environment === "development"? "testUsersPhoto" : "usersPhoto";
			const response = await GoogleDriveApi.uploadFile(
				req.user.email,
				[app.googleDriveFolders[usersPhoto]],
				user.userPhoto
			);
			user.userPhoto = response.data.id;
			console.log("status____", response.status);
		} catch (err) {
			console.log(err);
		}
	}

	const { userPhoto, phoneNumber, fullName } = new EditProfile(user);
	const newUserData = {};
	userPhoto && (newUserData.userPhoto = userPhoto);
	phoneNumber && (newUserData.phoneNumber = phoneNumber);
	fullName && (newUserData.fullName = fullName);

	if (Object.entries(newUserData).length) {
		try {
			const updatedItem = await usersCollection.findOneAndUpdate(
				{ "_id": ObjectId(userId) },
				{ $set: { ...newUserData } },
				{
					projection: { password: 0 },
					returnOriginal: false
				}
			);
			const user = updatedItem.value;
			if (user.userPhoto) {
				await refreshToken(appCollection);
				try {
					const response = await GoogleDriveApi.getFile(user.userPhoto);
					user.userPhoto = response.data;
				} catch (err) {
					console.log(err);
				}
			}
			res.send(user);
		} catch (err) {
			console.log(err);
		}
	} else {
		res.send("No user data for changes");
	}
}

async function getUsers(req, res) {
	const db = req.mongo.db("marketplaceApp");
	const usersCollection = db.collection("users");

	let cursor = null;
	try {
		cursor = await usersCollection.find();
	} catch (err) {
		console.log(err);
	}

	let users = null;
	try {
		users = await cursor.toArray();
	} catch (err) {
		console.log(err);
	}

	res.send(users);
}

async function getUser(req, res) {
	const db = req.mongo.db("marketplaceApp");
	const appCollection = db.collection("app");
	const usersCollection = db.collection("users");
	const userId = req.query.id;

	let user = null;
	try {
		user = await usersCollection.findOne(
			{ _id: ObjectId(userId) },
			{
				projection: { password: 0 },
			}
		);
	} catch (err) {
		console.log(err);
	}

	if (user.userPhoto) {
		await refreshToken(appCollection);
		try {
			const response = await GoogleDriveApi.getFile(user.userPhoto);
			user.userPhoto = response.data;
		} catch (err) {
			console.log(err);
		}
	}

	res.send(user);
}

async function logIn(req, res) {
	const userData = req.user;
	res.cookie("userData", userData);

	delete userData.password;
	res.send({ isAuthenticated: req.isAuthenticated(), user: userData });
}

async function logout(req, res) {
	const userData = req.user;

	req.logout();
	res.cookie("userData", "", { expires: new Date(0) });
	res.send({ isAuthenticated: req.isAuthenticated(), user: userData });
}

module.exports = {
	signUp,
	editProfile,
	getUsers,
	getUser,
	logout,
	logIn
};