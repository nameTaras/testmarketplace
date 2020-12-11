import React from "react";
import { observer } from "mobx-react";
import { withRouter, Link } from 'react-router-dom';
import { ButtonToolbar, Button } from 'react-bootstrap';
import SAVE_ICON from "../../icons/save-icon-black.svg";
import SAVED_ICON from "../../icons/saved-icon.png";
import ModalChatWindow from "./modalChatWindow/modalChatWindow.js"
import Config from "../../config.js";
import "./sellerInfo.css";

class SellerInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			liked: false,
			isVisible: false,
		};

		this.handleClose = this.handleClose.bind(this);
		this.getUserData = this.getUserData.bind(this);
		this.likeAndUnlikeProduct = this.likeAndUnlikeProduct.bind(this);
		this.handleChatWithSeller = this.handleChatWithSeller.bind(this);
	}

	async likeAndUnlikeProduct(productData) {
		const { isAuthenticated } = this.props.store.users.isAuthenticated;
		const productId = this.props.history.location.search.split('=')[1];
		const { 
			isProductLiked,
			unlikeProduct,
			likeProduct,
			unlikeProductSuccess
		} = this.props.store.liked;

		if (isAuthenticated) {
			isProductLiked(productId) ? 
				await unlikeProduct(productId) : await likeProduct(productData, productId);
		} else {
			const { likedProducts } =
				JSON.parse(window.localStorage.getItem("LikedList")) || { likedProducts: [] };

			if (likedProducts.some(product => product._id === productId)) {
				likedProducts.splice(likedProducts.findIndex(product => product._id === productId), 1);
				window.localStorage.setItem("LikedList", JSON.stringify({ likedProducts }));
				unlikeProductSuccess(productId);
				this.setState({ liked: false });
			} else {
				likedProducts.push(productData);
				window.localStorage.setItem("LikedList", JSON.stringify({ likedProducts }));
				this.setState({ liked: true });
			}
		}
	}

	handleChatWithSeller() {
		const { isAuthenticated } = this.props.store.users.isAuthenticated;
		if (isAuthenticated) {
			this.setState({ isVisible: true });
		} else {
			window.history.pushState({ 
				prevUrl: window.location.href },
				null,
				`${Config.host}/logIn`
			);
			window.history.go();
		}
	}

	handleClose() {
		this.setState({ isVisible: false });
	}

	getUserData() {
		const productId = this.props.history.location.search.split('=')[1];
		const productData = this.props.store.products.getStoresProduct(productId);
		const { userPhoto, fullName } = this.props.store.users.getStoresUser(productData.ownerId);

		return { userPhoto, fullName, productId, productData };
	}

	render() {
		const { userPhoto, fullName, productId, productData } = this.getUserData();
		const { isAuthenticated, userInfo } = this.props.store.users.isAuthenticated;

		let savedIcon = false;
		let showCreateMsg = true;
		if (isAuthenticated) {
			showCreateMsg = userInfo._id !== productData.ownerId;
			savedIcon = this.props.store.liked.isProductLiked(productId) ? SAVED_ICON : SAVE_ICON;;
		} else {
			const { likedProducts } =
				JSON.parse(window.localStorage.getItem("LikedList")) || { likedProducts: [] };
			savedIcon = likedProducts.some(product => product._id === productId) ? 
				SAVED_ICON : SAVE_ICON;
		}

		const userInitials = fullName.split(" ").map(item => item[0]).join("");
		return (
			<div className="seller-wrapper">
				<div className="seller-info">
					<div className="user-photo-wrapper">
						<Link to={`/personInfo?userId=${productData.ownerId}`}>
							{userPhoto ?
								<img
									className="user-photo"
									src={userPhoto}
									alt="user"
								/>
								:
								<div className="product-owner-initials-background">
									<span className="owner-initials">{userInitials}</span>
								</div>
							}
						</Link>
					</div>
					<Link to={`/personInfo?userId=${productData.ownerId}`}>
						<div className="seller-full-name">{fullName}</div>
					</Link>
				</div>
				<ButtonToolbar>
					{showCreateMsg &&
						<Button className="chat-btn" onClick={this.handleChatWithSeller}>
							Chat With Seller
						</Button>
					}
					<Button className="saved-btn" onClick={() => this.likeAndUnlikeProduct(productData)} >
						Add To Favorite
					</Button>
					<img src={savedIcon} alt="save icon" className="save-product-icon" />
				</ButtonToolbar>
				<ModalChatWindow
					isVisible={this.state.isVisible}
					handleClose={this.handleClose}
				/>
			</div>
		)
	}
}

const ObserverSellerInfo = observer(SellerInfo);

export default withRouter(ObserverSellerInfo);					