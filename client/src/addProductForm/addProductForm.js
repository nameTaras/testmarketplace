import React from "react";
import { inject } from "mobx-react";
import { Form, Button, Container } from 'react-bootstrap';
import Cfg from "../cfg.js";
import CLOSE_ICON from "../icons/close-icon.png";
import "./addProductForm.css";

@inject("store")

class AddProductForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			warnMore6Photo: false,
			title: "",
			location: "",
			description: "",
			photos: [],
			price: ""
		};

		this.deletePhoto = this.deletePhoto.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	deletePhoto(event) {
		const photos = this.state.photos;
		photos.splice(event.target.id, 1);

		this.setState({ photos, warnMore6Photo: false });
	}

	handleFocus() {
		if (this.state.warnMore6Photo === true) this.setState({ warnMore6Photo: false });
	}

	handleChange(event) {
		let name = event.target.name;
		if (name === "photos") {
			const photos = this.state.photos;
			let countPhotos = 0 + photos.length;
			for (const photo of event.target.files) {
				if (event.target.files.length > 6 || event.target.files.length + photos.length > 6) {
					this.setState({ warnMore6Photo: true });
					countPhotos++;
					if (countPhotos === 7) break;
				};

				// if (this.state.photos.length === 6) {
				// 	this.setState({ warnMore6Photo: true });
				// 	break;
				// }

				let reader = new FileReader();
				reader.readAsDataURL(photo);
				reader.onload = () => {
					photos.push(reader.result);

					this.setState({ [name]: photos });
				}
			}
		} else {
			this.setState({ [name]: event.target.value });
		}
	}

	async handleSubmit(event) {
		event.preventDefault();
		const response = await this.props.store.products.addProduct(this.state);
		const { _id } = await response.json();

		if (response.status === 200) {
			window.location.replace(`${Cfg.env().host}/productInfo?id=${_id}`);
		}
	}

	render() {
		const { title, location, photos, warnMore6Photo } = this.state;
		let isSubmitDisabled = true;

		if (title.trim() && location.trim()) {
			isSubmitDisabled = false;
		} else {
			isSubmitDisabled = true;
		}

		return (
			<Container className="add-product-form-container">
				<Form onSubmit={this.handleSubmit} >
					<h2 className="header-add-product-form">Add product</h2>
					<Form.Group>
						<Form.Label>TITLE</Form.Label>
						<Form.Control
							type="text"
							placeholder="For example: iron man suit"
							name="title"
							onChange={this.handleChange}
							onFocus={this.handleFocus}
							required />
					</Form.Group>
					<Form.Group>
						<Form.Label>LOCATION</Form.Label>
						<Form.Control
							type="text"
							placeholder="For example: Ternopil"
							name="location"
							onChange={this.handleChange}
							onFocus={this.handleFocus}
							required />
					</Form.Group>
					<Form.Group>
						<Form.Label>DESCRIPTION</Form.Label>
						<Form.Control
							as="textarea"
							rows="5"
							placeholder="For example: iron man suit"
							name="description"
							onChange={this.handleChange}
							onFocus={this.handleFocus}
							className="add-product-form-description" />
					</Form.Group>
					<Form.Group>
						<div>PHOTOS</div>
						{
							warnMore6Photo && 
								<div style={{ color: "red" }}>You can`t choose more 6 photos</div>
						}
						<Form.Control
							type="file"
							multiple
							name="photos"
							id="input-file"
							onChange={this.handleChange}
						/>
						<div className="input-file-container">
							<Form.Label htmlFor="input-file" className="input-file-label">
								<div style={{ marginTop: "22px", width: "max-content" }}>
									Choose a file
								</div>
							</Form.Label>
							{photos.map((photo, index) => {
								return (
									<div key={index} style={{ display: "inline", position: "relative" }} >
										<img src={photo} className="input-file-img" alt="product" />
										<img
											id={index}
											src={CLOSE_ICON}
											className="close-img"
											onClick={this.deletePhoto}
											alt="close-button"
										/>
									</div>
								)
							})}
						</div>
					</Form.Group>
					<Form.Group>
						<Form.Label>PRICE</Form.Label>
						<Form.Control
							type="text"
							placeholder="For example: $500"
							name="price"
							onChange={this.handleChange}
							onFocus={this.handleFocus}
						/>
					</Form.Group>
					<div className="submit-block">
						<Button variant="primary" type="submit" disabled={isSubmitDisabled}>
							Continue
						</Button>
					</div>
				</Form>
			</Container >
		)
	}
}

export default AddProductForm;