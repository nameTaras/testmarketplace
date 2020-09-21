import React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { Row, Col, Container } from 'react-bootstrap';
import NO_PHOTO_AVAILABLE from "../../../icons/no-photo-available.png";
import LINK_ICON from "../../../icons/link-icon.png";
import BACK_ICON from "../../../icons/back.png";
import './messageRecipient.css';

class MessageRecipient extends React.Component {
	render() {
		const { chats, users, products } = this.props.store;
		const selectedChat = chats.selectedChat;

		if (!selectedChat) return <div className="message-recipient"></div>;

		const product = products.getStoresProduct(selectedChat.productId);
		const { userInfo } = users.isAuthenticated;
		const recipientId = selectedChat.members.find(member => member !== userInfo._id);
		const recipient = users.list.find(user => user._id === recipientId);
		const userInitials = recipient.fullName.split(" ").map(item => item[0]).join("");

		return (
			<Container>
				<Row>
					{
						selectedChat && window.screen.width < 576 &&
						<Col xs="1" className="col-back-to-chats-btn">
							<img
								src={BACK_ICON}
								alt="back"
								className="back-to-chats-btn"
								onClick={chats.unselectChat} />
						</Col>
					}
					<Col lg="5" md="5" sm="4" xs="4">
						<Link to={`/personInfo?userId=${recipientId}`}>
							{recipient.userPhoto ?
								<img
									className="recipient-photo-chats"
									src={recipient.userPhoto}
									alt="user" /> :
								<div className="initials-chats-background">
									<div className="initials-recipient">{userInitials}</div>
								</div>
							}
							<div className="full-name-block">
								<p className="recipient-full-name">{recipient.fullName}</p>
							</div>
						</Link>
					</Col>
					<Col lg="5" md="7" sm="7" xs="7">
						<div className="recipient-product-info-block">
							<img
								src={(product && product.photos[0]) || NO_PHOTO_AVAILABLE}
								alt={product.title}
								className="recipient-product-image"
							/>
							<div className="recipient-product-title-price">
								<p>{product && product.title}</p>
								<p className="recipient-product-price">{product && product.price}</p>
							</div>
							<Link to={`/productInfo?id=${product && product._id}`} >
								<img className="link-icon" src={LINK_ICON} alt="link" />
							</Link>
						</div>
					</Col>
				</Row>
			</Container>
		)
	}
}

const ObserverMessageRecipient = observer(MessageRecipient);

export default ObserverMessageRecipient;