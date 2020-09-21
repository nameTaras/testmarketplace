import React from "react";
import { observer } from "mobx-react";
import { Form } from 'react-bootstrap';
import './messageForm.css';

class MessageForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { message: "" };

		this.handleChange = this.handleChange.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({ message: event.target.value });
	}

	handleFocus() {
		const { chats } = this.props.store;
		const chatId = chats.selectedChat.toJSON()._id;

		chats.readMessage(chatId)
	}

	async handleSubmit(event) {
		event.preventDefault();
		const { chats } = this.props.store;

		if (!chats.list.length) return;

		const { message } = this.state;

		const productData = {
			ownerId: chats.selectedChat.toJSON().productOwner,
			_id: chats.selectedChat.toJSON().productId
		};

		const response = await chats.createMessage(message, productData);
		const { message: msg, chatId } = await response.json();
		await chats.sortChatList();

		this.props.socket.emit('message', msg, chatId, chats.selectedChat.toJSON().productId);

		document.getElementById("message-form").reset();
	}

	render() {
		return (
			<Form id="message-form" onSubmit={this.handleSubmit}>
				<Form.Group className="message-input">
					<Form.Control
						rows="1"
						type="text"
						name="message"
						onChange={this.handleChange}
						onFocus={this.handleFocus}
						placeholder="Type your message here.."
						required />
				</Form.Group>
			</Form>
		)
	}
}

const ObserverMessageForm = observer(MessageForm);

export default ObserverMessageForm;