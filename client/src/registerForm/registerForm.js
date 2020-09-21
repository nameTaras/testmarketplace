import React from "react";
import { Link } from "react-router-dom";
import { Form, Button, Container } from 'react-bootstrap';
import { inject } from "mobx-react";
import Cfg from "../cfg.js";
import "./registerForm.css";

@inject("store")

class RegisterForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			fullName: "",
			password: "",
			passwordAgain: "",
			passwordNotMatch: false,
			emailAlreadExists: false
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.props.store.users.getUsers();
	}

	handleChange(event) {
		let name = event.target.name;
		this.setState({ [name]: event.target.value });
	}

	async handleSubmit(event) {
		event.preventDefault();
		const { passwordNotMatch, password, passwordAgain, email } = this.state;
		const users = this.props.store.users;

		const emailAlreadExists = users.list.some(user => user.email === email);
		this.setState({ emailAlreadExists });
		if (emailAlreadExists) return;

		if (password !== passwordAgain) {
			this.setState({ passwordNotMatch: true });
			return;
		} else if (password !== passwordAgain && passwordNotMatch === true) {
			this.setState({ passwordNotMatch: false });
		}

		const responseSignUp = await users.signUp(this.state);
		const { signed } = await responseSignUp.json();

		if (signed) {
			window.location.replace(Cfg.env().host);
		}
	}

	render() {
		return (
			<>
				<Container className="register-form">
					<Form onSubmit={this.handleSubmit}>
						<h2 className="header-register-form">Register</h2>
						<Form.Group>
							<Form.Label>EMAIL</Form.Label>
							<Form.Control
								type="email"
								placeholder="example@gmail.com"
								name="email"
								onChange={this.handleChange}
								required />
							{this.state.emailAlreadExists &&
								<div className="incorect-data-message">Email Address is Already Registered</div>
							}
						</Form.Group>
						<Form.Group >
							<Form.Label>FULL NAME</Form.Label>
							<Form.Control
								type="text"
								placeholder="Tony Stark"
								name="fullName"
								onChange={this.handleChange}
								required />
						</Form.Group>
						<Form.Group>
							<Form.Label>PASSWORD</Form.Label>
							<Form.Control
								type="password"
								name="password"
								onChange={this.handleChange}
								required />
						</Form.Group>
						<Form.Group>
							<Form.Label>PASSWORD AGAIN</Form.Label>
							<Form.Control
								type="password"
								name="passwordAgain"
								onChange={this.handleChange}
								required />
							{this.state.passwordNotMatch &&
								<div className="incorect-data-message">Password does not match</div>
							}
						</Form.Group>
						<div className="submit-block">
							<Button variant="primary" type="submit">
								Continue
						</Button>
						</div>
					</Form>
				</Container>
				<div className="already-registered">
					<p>I already have an account, <Link to="/logIn">LOG IN</Link></p>
				</div>
			</>
		)
	}
}

export default RegisterForm;