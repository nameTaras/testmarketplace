import React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import SAVE_ICON from "../icons/save-icon-black.svg";
import SAVED_ICON from "../icons/saved-icon.png";
import NO_PHOTO_AVAILABLE from "../icons/no-photo-available.png";
import './productItem.css';

class ProductItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = { liked: false };

		this.likeAndUnlikeProduct = this.likeAndUnlikeProduct.bind(this);
	}

	async likeAndUnlikeProduct() {
		const { productData, store} = this.props;		
		const { isAuthenticated } = store.users.isAuthenticated;
		const { _id: productId } = productData;
		const { 
			isProductLiked,
			unlikeProduct,
			likeProduct,
			unlikeProductSuccess
		} = store.liked;
		
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

	render() {
		const { photos, price, title, _id: productId } = this.props.productData;
		const { isAuthenticated } = this.props.store.users.isAuthenticated;
		const { likedProducts } =
			JSON.parse(window.localStorage.getItem("LikedList")) || { likedProducts: [] };
		const path = `/productInfo?id=${productId}`;
		const resizedTitle = title.length > 19 ? `${title.slice(0, 19)}...` : title;

		let liked = false;
		if (isAuthenticated) {
			liked = this.props.store.liked.isProductLiked(productId);
		} else {
			liked = likedProducts.find(product => product._id === productId);
		}
		const productLiked = liked ? SAVED_ICON : SAVE_ICON;
		return (
			<div className="product-item">
				<div className="product-image-block">
					<Link to={path}>
						<img
							src={photos[0] || NO_PHOTO_AVAILABLE}
							alt={title}
							className="product-item-image"
						/>
					</Link>
					<div
						className="like-product-block"
						onClick={this.likeAndUnlikeProduct}
					>
						<img src={productLiked} alt="like icon" className="like-product-img" />
					</div>
				</div>
				<div className="product-name-block" title={title}>
					<Link className="product-name" to={path} >{resizedTitle}</Link>
				</div>
				<p className="product-item-price">{price}</p>
			</div>
		)
	}
}

const ObserverProductItem = observer(ProductItem);

export default ObserverProductItem;