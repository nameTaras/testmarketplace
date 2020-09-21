import { types as t } from "mobx-state-tree";
import { ChatListModel } from "./ChatsStore.js";
import { LikedListModel } from "./LikedStore.js";
import { ProductListModel } from "./ProductsStore.js";
import { UserListModel } from "./UsersStore.js";
import { onSnapshot, applySnapshot } from "mobx-state-tree";

const RootStore = t
	.model("RootStore", {
		chats: t.optional(ChatListModel, {}),
		liked: t.optional(LikedListModel, {}),
		products: t.optional(ProductListModel, {}),
		users: t.optional(UserListModel, {})
	});

export default (function () {
	const rootStore = RootStore.create({});

	onSnapshot(rootStore, snapshot => {
		const userList = snapshot.users.list;

		userList && window.localStorage.setItem("__persist", JSON.stringify({
			users: {
				list: userList
			}
		}));
	});

	const snapshot = window.localStorage.getItem("__persist");

	if (snapshot) {
		applySnapshot(rootStore, JSON.parse(snapshot));
	}

	return rootStore;
})();