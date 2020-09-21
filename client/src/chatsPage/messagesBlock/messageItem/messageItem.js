import React from "react";
import { observer } from "mobx-react";
import './messageItem.css';

class MessageItem extends React.Component {
	render() {
		const { chats, users } = this.props.store;
		const { userInfo } = users.isAuthenticated;
		const selectedChat = chats.selectedChat;

		if (!selectedChat) return <></>;

		const messages = selectedChat.messages || [];

		return messages.map((item, index) => {
			const ownMessages = userInfo._id === item.authorId;
			const msgDate = new Date(+item.date);
			const msgHours = msgDate.getHours();
			const msgMinutes = msgDate.getMinutes();

			return (
				<React.Fragment key={index}>
					<div className="message-item">
						<p className={ownMessages ? "own-message" : "guest-message"} >
							&nbsp;{item.message}&nbsp;
							<span
								className={ownMessages ? "own-message-time" : "guest-message-time"}>
								{`${msgHours}:${msgMinutes < 10 ? "0" + msgMinutes : msgMinutes}`}
							</span>
						</p>
					</div>
				</React.Fragment>
			)
		})
	}
}

const ObserverMessageItem = observer(MessageItem);

export default ObserverMessageItem;