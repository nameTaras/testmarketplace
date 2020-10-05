import React from "react";
import { withRouter } from 'react-router-dom';
import { observer } from "mobx-react";
import { Container, Col, Row } from 'react-bootstrap';
import NO_PHOTO_AVAILABLE from "../icons/no-photo-available.png";
import TO_LEFT from "../icons/to-left.png";
import Loader from "../loader/loader.js";
import SellerInfo from "./sellerInfo/sellerInfo.js";
import "./productInfo.css";

class ProductInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			productData: null,
			ownerData: null,
			showLoading: true,
			photoNumber: 0
		};

		this.loadProductData = this.loadProductData.bind(this);
		this.onRight = this.onRight.bind(this);
		this.onLeft = this.onLeft.bind(this);
	}

	onLeft(photoNumber) {
		photoNumber--;
		if (photoNumber < 0) return;
		this.setState({ photoNumber });
	}

	onRight(photoNumber) {
		const arrayOfPhotos = this.state.productData.photos;

		photoNumber++;
		if (photoNumber === arrayOfPhotos.length) return;
		this.setState({ photoNumber });
	}

	async loadProductData() {
		const productId = this.props.history.location.search.split('=')[1];
		const resGetProduct = await this.props.store.products.getProduct(productId);
		const productData = await resGetProduct.json();
		const resGetUser = await this.props.store.users.getUser(productData.ownerId);
		const ownerData = await resGetUser.json();
		await this.props.store.liked.getLikedProducts();

		this.setState({ productData, ownerData, showLoading: false });
	}

	componentDidMount() {
		this.loadProductData();
	}

	render() {
		const { photoNumber, showLoading } = this.state;
		if (showLoading) return <Loader />;

		const { photos, price, title, location, description } = this.state.productData;
		return (
			<Container>
				<Row className="product-wrapper">
					<Col lg="1"></Col>
					<Col lg="7" md="7" sm="12" xs="12">
						<div className="product-info">
							{photos && <img
								className="to-left-button"
								src={TO_LEFT}
								onClick={() => this.onLeft(photoNumber)}
								alt="to-left"
							/>}
							<img
								src={photos ? photos[photoNumber] : NO_PHOTO_AVAILABLE}
								alt={title}
								className="product-image"
							/>
							{photos && <img
								className="to-right-button"
								src={TO_LEFT}
								onClick={() => this.onRight(photoNumber)}
								alt="to-right"
							/>}
							<div className="product-info-price">{price}</div>
							<h3 className="product-name-date">{title}</h3>
							<h4 className="product-location">{location}</h4>
							<hr />
							<p className="product-description">{description}</p>
						</div>
					</Col>
					<Col lg="3" md="5" sm="12" xs="12">
						<SellerInfo store={this.props.store} />
					</Col>
					<Col lg="1"></Col>
				</Row>
			</Container>
		)
	}

}

const ObserverProductInfo = observer(ProductInfo);

export default withRouter(ObserverProductInfo);