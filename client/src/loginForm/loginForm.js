import React from "react";
import { Link } from "react-router-dom";
import { Form, Button, Container } from 'react-bootstrap';
import { inject } from "mobx-react";
import Config from "../cfg.js";
import "./loginForm.css";

@inject("store")

class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { email: "", password: "", incorrectData: false };

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		let name = event.target.name;
		this.setState({ [name]: event.target.value });
	}

	async handleSubmit(event) {
		event.preventDefault();
		const responseSignIn = await this.props.store.users.signIn(this.state);
		const incorrectData = responseSignIn.statusText === "Unauthorized" ? true : false;

		if (incorrectData) {
			this.setState({ incorrectData });
		} else {
			if (window.history.state.prevUrl) {
				window.location.replace(window.history.state.prevUrl);
			} else {
				window.location.replace(Config.env().host);
			}
		}
	}

	render() {
		return (
			<>
				<Container className="login-form">
					<Form onSubmit={this.handleSubmit}>
						<h2 className="header-login-form">Login</h2>
						{this.state.incorrectData &&
							<Container className="incorrect-data-container">
								<div className="incorect-data-message">Incorrect Email Address or Password</div>
							</Container>
						}
						<Form.Group>
							<Form.Label>EMAIL</Form.Label>
							<Form.Control
								type="email"
								placeholder="example@gmail.com"
								name="email"
								onChange={this.handleChange}
								required />
						</Form.Group>
						<Form.Group>
							<Form.Label>PASSWORD</Form.Label>
							<Form.Control type="password" name="password" onChange={this.handleChange} required />
							<Form.Text>
								<Link to="/restorePassword">Don`t remember password?</Link>
							</Form.Text>
						</Form.Group>
						<div className="submit-block">
							<Button variant="primary" type="submit">
								Continue
						</Button>
						</div>
					</Form>
				</Container>
				<div className="yet-no-registered">
					<p>I have no account, <Link to="/signUp">REGISTER NOW</Link></p>
				</div>
			</>
		)
	}
}

export default LoginForm;