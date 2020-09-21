import React from "react";
import { inject } from "mobx-react";
import { Form, Button, Container } from 'react-bootstrap';
import Cfg from "../cfg.js";
import "./editProfileForm.css";

@inject("store")

class EditProfileForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { fullName: "", phoneNumber: "", userPhoto: "" };

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		let name = event.target.name;
		if (name === "userPhoto") {
			let reader = new FileReader();
			reader.readAsDataURL(event.target.files[0]);
			reader.onload = () => {
				this.setState({ [name]: reader.result });
			}
		} else {
			this.setState({ [name]: event.target.value });
		}
	}

	async handleSubmit(event) {
		event.preventDefault();
		const response = await this.props.store.users.editProfile({ ...this.state });
		const responseData = await response.json();

		if (response.status === 200) {
			window.location.replace(`${Cfg.env().host}/personInfo?userId=${responseData._id}`);
		}
	}

	handleImgClick(event) {
		document.querySelector(".upgrate-photo-btn").click();
	}

	render() {
		const { userInfo } = this.props.store.users.isAuthenticated;
		const userInitials = userInfo.fullName.split(" ").map(item => item[0]).join("");

		return (
			<Container className="edit-profile-form" >
				<div onSubmit={this.handleSubmit} >
					<h2 className="header-edit-profile-form">Edit profile</h2>
					<div className="wrapper-photo">
						{userInfo.userPhoto || this.state.userPhoto ?
							<img
								className="user-photo"
								src={this.state.userPhoto || userInfo.userPhoto}
								alt="user"
								onClick={this.handleImgClick} /> :
							<div
								className="edit-profile-user-initials-background"
								onClick={this.handleImgClick}>
								<div className="edit-profile-initials">{userInitials}</div>
							</div>
						}
						<input
							type="file"
							className="upgrate-photo-btn"
							name="userPhoto"
							onChange={this.handleChange} />
					</div>
					<Form>
						<Container>
							<Form.Group>
								<Form.Label>FULL NAME</Form.Label>
								<Form.Control
									type="text"
									placeholder={userInfo.fullName}
									name="fullName"
									onChange={this.handleChange} />
							</Form.Group>

							<Form.Group>
								<Form.Label>PHONE NUMBER</Form.Label>
								<Form.Control
									type="tel"
									placeholder={userInfo.phoneNumber || "+380689463237"}
									name="phoneNumber"
									onChange={this.handleChange} />
							</Form.Group>
							<div className="submit-block">
								<Button variant="success" type="submit" className="submit-button">
									Save
								</Button>
							</div>
						</Container>
					</Form>
				</div>
			</Container>
		)
	}
}

export default EditProfileForm;