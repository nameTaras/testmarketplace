import React from "react";
import { Container } from 'react-bootstrap';
import MessageRecipient from "./messageRecipient/messageRecipient.js";
import MessageItem from "./messageItem/messageItem.js";
import MessageForm from "./messageForm/messageForm.js";
import './messagesBlock.css';

class MessagesBlock extends React.Component {
	readMessage() {
		const { chats } = this.props.store;		
		const selectedChat = chats.selectedChat;
		chats.readMessage(selectedChat._id);
	}

	render() {
		return (
			<>
				<MessageRecipient store={this.props.store} />
				<Container className="messages" onClick={() => this.readMessage()}>
					<MessageItem store={this.props.store} />
				</Container>
				<MessageForm store={this.props.store} socket={this.props.socket}/>
			</>
		)
	}
}

export default MessagesBlock;