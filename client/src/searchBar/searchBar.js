import React from 'react';
import { inject } from "mobx-react";
import { Form, Button, Col } from 'react-bootstrap'
import "./searchBar.css";

@inject("store")

class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = { title: "", location: "" };

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		let name = event.target.name;
		this.setState({ [name]: event.target.value });
	}

	async handleSubmit(event) {
		event.preventDefault();
		const { products, liked } = this.props.store;
		let filter = {};
		for (let item in this.state) {
			if (this.state[item]) filter[item] = this.state[item]
		}
		await products.getProducts(filter);
		await liked.getLikedProducts();
	}

	render() {
		return (
			<Form onSubmit={this.handleSubmit}>
				<Form.Row className="search-bar">
					<Col lg="2" md="2" sm="2" xl="2" xs="2" className="search-bar-col"></Col>
					<Col lg="4" md="4" sm="4" xl="4" xs="4" className="search-bar-col">
						<Form.Control
							type="text"
							placeholder="Search products by name"
							name="title"
							onChange={this.handleChange} />
					</Col>
					<Col lg="2" md="2" sm="2" xl="2" xs="2" className="search-bar-col">
						<Form.Control
							type="text"
							placeholder="Location"
							name="location"
							onChange={this.handleChange} />
					</Col>
					<Col lg="2" md="2" sm="2" xl="2" xs="2" className="search-bar-col">
						<Button type="submit" className="submit">
							SEARCH
						</Button>
					</Col>
					<Col lg="2" md="2" sm="2" xl="2" xs="2" className="search-bar-col"></Col>
				</Form.Row>
			</Form>
		)
	}
}

export default SearchBar;