import React from "react";
import { inject } from "mobx-react";
import { Form, Button, Container } from 'react-bootstrap';
import "./restorePasswordForm.css";

@inject("store")

class RestorePasswordForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { email: "", messageSended: false, emailNotExists: false };

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.props.store.users.getUsers();
	}

	handleChange(event) {
		this.setState({ email: event.target.value });
	}

	handleSubmit(event) {
		event.preventDefault();
		const users = this.props.store.users.list;
		const emailExists = users.some(user => user.email === this.state.email);

		if (!emailExists) {
			this.setState({ emailNotExists: true });
			return;
		}

		this.setState({ messageSended: true });
	}

	render() {
		return (
			<Form className="restore-password-form" onChange={this.handleChange} onSubmit={this.handleSubmit} >
				<h2 className="header-restore-password-form">Restore password</h2>
				{this.state.messageSended ?
					<div>A message with instructions was sent to the email address</div> :
					<>
						<Form.Group>
							<Form.Label>EMAIL</Form.Label>
							<Form.Control type="email" placeholder="example@gmail.com" />
							{this.state.emailNotExists &&
								<Container className="incorrect-data-container">
									<div className="incorect-data-message">
										User with this email address does not exist
									</div>
								</Container>
							}
						</Form.Group>
						<div className="submit-block">
							<Button variant="primary" type="submit">
								Continue
							</Button>
						</div>
					</>}
			</Form>
		)
	}
}

export default RestorePasswordForm;