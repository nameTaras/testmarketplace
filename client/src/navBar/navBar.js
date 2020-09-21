import React from 'react';
import { observer } from "mobx-react";
import { Navbar, Button, Nav, Container } from 'react-bootstrap';
import { Link } from "react-router-dom";
import DropdownToLogOut from "./dropdownToLogOut/dropdownToLogOut.js";
import SAVE_ICON from "../icons/save-icon-white.png";
import SAVED_ICON from "../icons/saved-icon-white.png";
import CHATS_ICON from "../icons/chats-icon.png";
import UNREAD_MESSAGE from "../icons/unread-message.png";
import HUMBURGER_ICON from "../icons/hamburger_icon.svg";
import LOGO from "../icons/logo.png";
import "./navBar.css";

class NavBar extends React.Component {
	componentDidMount() {
		const { chats, users } = this.props.store;
		const { isAuthenticated } = users.isAuthenticated;

		isAuthenticated && chats.unreadMessage();
	}

	render() {
		const { isAuthenticated, userInfo } = this.props.store.users.isAuthenticated;
		const savedListIcon = 
			window.location.pathname === "/savedList" ? SAVED_ICON : SAVE_ICON;
		const unreadMessageChats = 
			this.props.store.chats.unreadMessageChats(isAuthenticated && userInfo._id);

		return (
			<Navbar>
				<Container>
					<Navbar.Brand>
						<Link to="/"><img src={LOGO} alt="logo" className="logo" /></Link>
					</Navbar.Brand>
					<Navbar.Collapse className="justify-content-end">
						<Nav>
							{isAuthenticated &&
								<Link to="/chats" className="chats-btn nav-link">
									<img 
										className="chats-icon" 
										src={CHATS_ICON} 
										alt="chats icon"
									/>
									<img
										alt="unread message icon"
										className={unreadMessageChats.length ?
											"unread-message-icon-true" : "unread-message-icon"}
										src={UNREAD_MESSAGE}
									/>
								</Link>
							}
							<Link to="/addProduct" className="nav-link sell-btn">
								<Button variant="success" >Sell</Button>
							</Link>
							{isAuthenticated ?
								<DropdownToLogOut store={this.props.store} /> :
								<Link to="/logIn" className="nav-link">
									<Button className="login-button">Login</Button>
								</Link>
							}
							<Link to="/savedList" className="dropdown-item nav-link saved-list-icon">
								<img 
									src={savedListIcon}
									className="save-icon"
									alt="liked product"
								/>
							</Link>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		)
	}
}

const ObserverNavBar = observer(NavBar);

export default ObserverNavBar;