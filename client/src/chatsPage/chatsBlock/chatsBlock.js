import React from "react";
import { observer } from "mobx-react";
import ChatItem from "./chatItem/chatItem.js";
import Loader from "../../loader/loader.js";
import './chatsBlock.css';

class ChatsBlock extends React.Component {
	constructor(props) {
		super(props);
		this.state = { showLoading: true };
	}

	async getChatInfo() {
		const { chats, users, products } = this.props.store;
		const { userInfo } = users.isAuthenticated;
		const responseGetChats = await chats.loadChats();
		const chatList = await responseGetChats.json();

		if (chatList.length) {
			for (const chat of chatList) {
				const recipientId = chat.members.find(member => member !== userInfo._id);
				await users.getUser(recipientId);
				await products.getProduct(chat.productId);
			}

			if (this._mounted) this.setState({ showLoading: false });
		} else {
			if (this._mounted) this.setState({ showLoading: false });
		}
	}

	componentDidMount() {
		this._mounted = true;
		this.getChatInfo();
	}

	componentWillUnmount() {
        this._mounted = false;
    }

	render() {
		const { showLoading } = this.state;
		if (showLoading) return <Loader />;
		
		const chats = this.props.store.chats.list;
		if (!chats.length) {
			return <h4 style={{ textAlign: "center" }}>Chat don`t exist yet</h4>;
		}

		return chats.map(element => {
			return <ChatItem key={element._id} chat={element} store={this.props.store} />;
		});
	}
}

const ObserverChatsBlock = observer(ChatsBlock);

export default ObserverChatsBlock;