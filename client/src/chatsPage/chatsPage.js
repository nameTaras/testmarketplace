import React from "react";
import { Col } from 'react-bootstrap';
import { observer } from "mobx-react";
import ChatsBlock from "./chatsBlock/chatsBlock.js";
import MessagesBlock from "./messagesBlock/messagesBlock.js";
import "./chatsPage.css";

class ChatsPage extends React.Component {
	render() {
		const selected = this.props.store.chats.selectedChat;

		const displayChatsXSSize = selected ? "not-display" : "display"
		const displayCorrespondenceXSSize = selected ? "display" : "not-display"

		return (
			<div className="chats-page-container">
				<Col
					lg="5" md="5" sm="5" xs="12"
					className={`chats-wrapper ${displayChatsXSSize}`}>
					<ChatsBlock store={this.props.store} />
				</Col>
				<Col lg="7" md="7" sm="7" xs="12"
					className={`correspondence-wrapper ${displayCorrespondenceXSSize}`}>
					<MessagesBlock store={this.props.store} socket={this.props.socket}/>
				</Col>
			</div>
		)
	}
}

const ObserverChatsPage = observer(ChatsPage);

export default ObserverChatsPage;