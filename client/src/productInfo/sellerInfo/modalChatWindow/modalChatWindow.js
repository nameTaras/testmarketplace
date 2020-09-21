import React from "react";
import Modal from 'react-modal';
import { Button } from 'react-bootstrap';
import { inject } from "mobx-react";
import { Link, withRouter } from 'react-router-dom';
import "./modalChatWindow.css";

@inject("store")
@inject("socket")

class ModalChatWindow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: ""
		}

		this.handleChange = this.handleChange.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.getOwnerData = this.getOwnerData.bind(this);
	}

	handleChange(event) {
		this.setState({ message: event.target.value });
	}

	async sendMessage(productData) {
		const { message } = this.state;

		if (!message) return;

		await this.props.store.chats.createChat(productData);
		const response = await this.props.store.chats.createMessage(message, productData);
		const { message: msg, chatId } = await response.json();
		await this.props.store.chats.sortChatList();
		this.props.socket.emit('message', msg, chatId, productData._id);

		this.props.handleClose();
	}

	getOwnerData() {
		const productId = this.props.history.location.search.split('=')[1];
		const productData = this.props.store.products.getStoresProduct(productId);
		const { userPhoto, fullName } = 
			this.props.store.users.getStoresUser(productData.ownerId);

		return { userPhoto, fullName, productData };
	}

	render() {
		const { userPhoto, fullName, productData } = this.getOwnerData();
		const userInitials = fullName.split(" ").map(item => item[0]).join("");

		return (
			<Modal
				isOpen={this.props.isVisible}
				onRequestClose={this.props.handleClose}
				className="modal-window"
			>
				<h4 className="modal-window-header">Contact seller</h4>
				<h5>{productData.title}</h5>
				<div className="link-product-owner">
					<Link to={`/personInfo?userId=${productData.ownerId}`}>
						{userPhoto ?
							<div className="modal-user-photo-block">
								<img
									className="modal-user-photo"
									src={userPhoto}
									alt="user"
								/>
							</div> :
							<div className="modal-user-initials-background">
								<span>{userInitials}</span>
							</div>
						}
					</Link>
					<Link to={`/personInfo?userId=${productData.ownerId}`}>
						<div className="modal-chat-full-name-block">
							<span>{fullName}</span>
						</div>
					</Link>
				</div>
				<br />
				<span>MESSAGE</span>
				<textarea
					type="text"
					placeholder="Type a message"
					onChange={this.handleChange}
					className="modal-message-input"
				/>
				<div className="submit-block">
					<Button
						variant="success"
						onClick={() => this.sendMessage(productData)}
						className="submit-button">
						Send message
					</Button>
				</div>
			</Modal>
		)
	}
}

export default withRouter(ModalChatWindow);