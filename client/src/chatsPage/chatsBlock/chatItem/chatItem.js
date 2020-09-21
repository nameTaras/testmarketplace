import React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { Row, Col, Container } from 'react-bootstrap';
import NO_PHOTO_AVAILABLE from "../../../icons/no-photo-available.png";
import MESSAGE_ICON from "../../../icons/message-icon.png";
import './chatItem.css';

class ChatItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = { selected: false };

		this.selectChat = this.selectChat.bind(this);
	}

	selectChat(self) {
		const { chats } = this.props.store;
		chats.selectChat(self.props.chat);
		chats.readMessage(this.props.chat._id);
	}

	countUnreadMessages(chat, store) {
		const { userInfo } = store.users.isAuthenticated;
		const authorizedUserId = userInfo._id;
		const updatedChat = store.chats.list.find(item => chat._id === item._id);
		const countUnreadMessages = updatedChat.messages.filter(message => {
			return message.unreadMessage === true && authorizedUserId !== message.authorId;
		});

		return countUnreadMessages;
	}

	lastMessageInfo(chat, store) {
		const product = store.products.getStoresProduct(chat.productId);
		const user = store.users.getStoresUser(product.ownerId);
		const lastMsg = chat.messages[0].message
		const lastMsgTime = chat.messages[0].date

		const msgDate = new Date(+lastMsgTime);
		const msgHours = msgDate.getHours();
		const msgMinutes = msgDate.getMinutes();

		return { msgMinutes, msgHours, lastMsg, product, user };
	}

	componentDidMount() {
		const { chat, store } = this.props;
		if (window.screen.width > 576) {
			!store.chats.selectedChat && store.chats.selectChat(chat);
			if (store.chats.selectedChat._id === chat._id) this.setState({ selected: true });
		}

		chat.isSelect && store.chats.readMessage(chat._id);
	}

	render() {
		const { chat, store } = this.props;
		const countUnreadMessages = this.countUnreadMessages(chat, store);
		const { msgMinutes, msgHours, lastMsg, product, user } = 
			this.lastMessageInfo(chat, store);

		return (
			<Container className={chat.isSelect ? "chat-item-selected" : "chat-item"}
				onClick={() => this.selectChat(this)}
			>
				<Row >
					<Col className="chat-item-correspondence-info" lg="3" md="4" sm="4" xs="4">
						<p className="chat-item-user-full-name">{user.fullName}</p>
						<div className="chat-item-user-last-msg-block">
							<img src={MESSAGE_ICON} alt="message" />
							<span className="chat-item-user-last-msg">{lastMsg}</span>
						</div>
					</Col>
					<Col className="chat-item-product-info" lg="7" md="6" sm="6" xs="6">
						<Link to={`/productInfo?id=${product && product._id}`} >
							<img
								src={(product && product.photos[0]) || NO_PHOTO_AVAILABLE}
								className="chat-item-product-image"
								alt={product && product.title}
							/>
							<div className="chat-item-product-title-and-price">
								<p className="chat-item-product-title">
									{product && product.title}
								</p>
								<p className="chat-item-product-price">
									{product && product.price}
								</p>
							</div>
						</Link>
					</Col>
					<Col className="chat-item-last-msg-info" lg="2" md="2" sm="2" xs="2">
						<p className="chat-item-last-msg-time">
							{`${msgHours}:${msgMinutes < 10 ? "0" + msgMinutes : msgMinutes}`}
						</p>
						<div className={countUnreadMessages.length ?"unread-message-true" : "unread-message-false"}>
							{countUnreadMessages.length}
						</div>
					</Col>
				</Row>
			</Container>
		)
	}
}

const ObserverChatItem = observer(ChatItem);

export default ObserverChatItem;