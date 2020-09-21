import { types as t } from "mobx-state-tree";
import Api from "../api.js";

const UserModel = t
	.model("UserModel", {
		email: t.optional(t.string, ""),
		fullName: t.optional(t.string, ""),
		_id: t.optional(t.string, ""),
		phoneNumber: t.optional(t.string, ""),
		userPhoto: t.optional(t.string, ""),
		isAuthenticated: false
	});

export const UserListModel = t
	.model("UserListModel", {
		list: t.array(UserModel)
	})
	.views(store => ({
		get isAuthenticated() {
			const user = { isAuthenticated: false, userInfo: null };
			store.list.length > 0 && store.list.forEach(item => {
				if (item.isAuthenticated === true) {
					user.isAuthenticated = true;
					user.userInfo = item
				}
			});

			return user;
		},

		getStoresUser(userId) {
			return store.list.find(user => user._id === userId);
		}
	}))
	.actions(store => ({
		async signUp(userData) {
			const method = "POST";
			const contentType = "application/json";
			const body = JSON.stringify({
				email: userData.email,
				fullName: userData.fullName,
				password: userData.password
			});
			const options = Api.getOptions(method, contentType, body);
			const endpoint = "/signUp";

			const { response } = await Api.request(endpoint, options);
			await store.signIn(userData);

			return response;
		},

		async signIn(userData) {
			const method = "POST";
			const contentType = "application/json";
			const body = JSON.stringify({
				email: userData.email,
				password: userData.password
			});
			const options = Api.getOptions(method, contentType, body);
			const endpoint = "/logIn";

			const { response, responseData } = await Api.request(endpoint, options);

			if (responseData) {
				const userExist = store.list.some(item => item._id === responseData.user._id);

				!userExist && await store.getUser(responseData.user._id);
				store.signInSuccess(responseData)
			}

			return response;
		},

		signInSuccess(signInRes) {
			store.list.length > 0 && store.list.forEach(item => {
				if (item._id === signInRes.user._id) {
					item.isAuthenticated = true
				}
			});
		},

		async logOut() {
			const method = "GET";
			const contentType = "application/json";
			const options = Api.getOptions(method, contentType);
			const endpoint = "/logout";

			const { response, responseData } = await Api.request(endpoint, options);
			store.logOutSuccess(responseData);

			return response;
		},

		logOutSuccess(res) {
			store.list.length > 0 && store.list.forEach(item => {
				if (item._id === res.user._id) {
					item.isAuthenticated = false;
				}
			});
		},

		async editProfile(userData) {
			const { fullName, userPhoto, phoneNumber } = userData;
			let formData = new FormData();
			formData.append('userPhoto', userPhoto);
			formData.append('fullName', fullName);
			formData.append('phoneNumber', phoneNumber);
			const method = "PUT";
			const contentType = "";
			const options = Api.getOptions(method, contentType, formData);
			const endpoint = "/editProfile";

			const { response, responseData } = await Api.request(endpoint, options);
			store.editProfileSuccess(responseData);

			return response;
		},

		editProfileSuccess(user) {
			const userIndex = store.list.findIndex(item => item.isAuthenticated === true);
			store.list[userIndex] = { ...store.list[userIndex], ...user };
		},

		async getUser(userId) {
			const method = "GET";
			const contentType = "application/json";
			const options = Api.getOptions(method, contentType);
			const endpoint = `/getUser?id=${userId}`;

			const { response, responseData } = await Api.request(endpoint, options);
			store.getUserSuccess(responseData);

			return response;
		},

		getUserSuccess(user) {
			const userExist = store.list.some(item => item._id === user._id);
			!userExist && store.list.push(user);
		},

		async getUsers() {
			const method = "GET";
			const contentType = "application/json";
			const options = Api.getOptions(method, contentType);
			const endpoint = "/getUsers";

			const { response, responseData } = await Api.request(endpoint, options);
			store.getUsersSuccess(responseData);

			return response;
		},

		getUsersSuccess(usersList) {
			store.list = usersList;
		}
	}));