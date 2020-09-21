import { types as t } from "mobx-state-tree";
import Api from "../api.js";

const MessageModel = t
	.model("MessageModel", {
		authorId: t.string,
		message: t.string,
		date: t.string,
		unreadMessage: t.boolean
	});

const ChatsModel = t
	.model("ChatsModel", {
		_id: t.string,
		members: t.array(t.string),
		messages: t.array(MessageModel),
		productId: t.string,
		isSelect: false
	});

export const ChatListModel = t
	.model("ChatListModel", {
		list: t.array(ChatsModel)
	})
	.views(store => ({
		get selectedChat() {
			return store.list.find(item => item.isSelect === true);
		},

		unreadMessageChats(userId) {
			return store.list.filter(item => item.messages.some(message => {
				return userId !== message.authorId && message.unreadMessage === true;
			}));
		}
	}))
	.actions(store => ({
		async getChat(chatId) {
			const method = "GET";
			const contentType = "application/json";
			const options = Api.getOptions(method, contentType);
			const endpoint = `/getChat?chatId=${chatId}`;

			const { response, responseData } = await Api.request(endpoint, options);
			const { chat } = responseData;
			chat && store.getChatSuccess(chat);

			return response;
		},

		getChatSuccess(chat) {
			const chatExist = store.list.some(item => chat._id === item._id);
			if (!chatExist) store.list.unshift(chat);
		},

		async loadChats() {
			const method = "GET";
			const contentType = "application/json";
			const options = Api.getOptions(method, contentType);
			const endpoint = "/getChats";

			const { response, responseData } = await Api.request(endpoint, options);
			store.onLoadChatsSuccess(responseData);

			return response;
		},

		async unreadMessage() {
			const method = "GET";
			const contentType = "application/json";
			const options = Api.getOptions(method, contentType);
			const endpoint = "/unreadMessage";

			const { response, responseData } = await Api.request(endpoint, options);
			store.onLoadChatsSuccess(responseData);

			return response;
		},

		onLoadChatsSuccess(chatList) {
			chatList && chatList.forEach(chat => {
				const chatExist = store.list.some(storeChat => chat._id === storeChat._id);
				!chatExist && store.list.push(chat);
			});
			store.sortChatList();
		},

		sortChatList() {
			let sortedChatList = store.list.toJSON().sort((a, b) => {
				return b.messages[0].date - a.messages[0].date;
			});

			store.list = sortedChatList;
		},

		selectChat(chat) {
			store.list.forEach(item => {
				if (item.isSelect === true) item.isSelect = false;
				if (item._id === chat._id) {
					item.isSelect = true;
					item.messages.forEach(message => message.unreadMessage = false);
				};
			});
		},

		unselectChat() {
			!!store.list.length && store.list.forEach(item => {
				if (item.isSelect === true) item.isSelect = false;
			});
		},

		async createChat(productData) {
			const method = "POST";
			const contentType = "application/json";
			const body = JSON.stringify({
				productOwner: productData.ownerId,
				productId: productData._id
			});
			const options = Api.getOptions(method, contentType, body);
			const endpoint = "/createChat";

			const { response } = await Api.request(endpoint, options);

			return response;
		},

		async readMessage(chatId) {
			const method = "POST";
			const contentType = "application/json";
			const body = JSON.stringify({ chatId });
			const options = Api.getOptions(method, contentType, body);
			const endpoint = "/readMessage";

			const { response, responseData } = await Api.request(endpoint, options);
			store.readMessageSuccess(responseData.chat);

			return response;
		},

		readMessageSuccess(updatedChat) {
			store.list.forEach(chat => {
				if (chat._id === updatedChat._id) {
					chat.messages.forEach((message, index) => {
						if (message.unreadMessage !== updatedChat.messages[index].unreadMessage) {
							chat.messages[index] = updatedChat.messages[index];
						}
					});
				}
			});
		},

		async createMessage(message, productData) {
			const method = "POST";
			const contentType = "application/json";
			const body = JSON.stringify({
				message,
				date: Date.now(),
				productId: productData._id
			});
			const options = Api.getOptions(method, contentType, body);
			const endpoint = "/createMessage";

			const { response, responseData } = await Api.request(endpoint, options);
			store.updateCorrespondenceChat(responseData);

			return response;
		},

		updateCorrespondenceChat(messageData) {
			store.list.forEach(item => {
				if (messageData.chatId === item._id) item.messages.unshift(messageData.message);
			});
		}
	}));