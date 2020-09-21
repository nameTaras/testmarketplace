import React from "react";
import { Link } from "react-router-dom";
import { NavDropdown, Dropdown } from 'react-bootstrap';
import { observer } from "mobx-react";
import "./dropdownToLogOut.css";

class DropdownToLogOut extends React.Component {
    constructor(props) {
        super(props);

        this.handleLogOut = this.handleLogOut.bind(this);
    }

    async handleLogOut() {
        await this.props.store.users.logOut();
    }

    userInfo(userInitials) {
        const { userInfo } = this.props.store.users.isAuthenticated;

        return (
            <Dropdown.Toggle variant="success">
                {userInfo.userPhoto ?
                    <img
                        className="user-photo-navbar"
                        src={userInfo.userPhoto}
                        alt="user"
                    /> :
                    <div>{userInitials}</div>
                }
            </Dropdown.Toggle>
        )
    }

    componentDidMount(){
        const { isAuthenticated } = this.props.store.users.isAuthenticated;
        if (isAuthenticated) {
            if (window.location.pathname !== "/chats") this.props.store.chats.unselectChat();
        }
    }

    render() {
        const { isAuthenticated, userInfo } = this.props.store.users.isAuthenticated;
        let userInitials = "";
        if (isAuthenticated) {
            userInitials = userInfo.fullName.split(" ").map(item => item[0]).join("");
        }

        return (
            <NavDropdown
                title={this.userInfo(userInitials)}
                id="basic-nav-dropdown"
                drop="left"
            >
                <NavDropdown.Item as="button">
                    <Link to={`/personInfo?userId=${userInfo._id}`}>
                        {userInfo.userPhoto ?
                            <div className="user-photo-block">
                                <img
                                    className="user-photo-dropdown"
                                    src={userInfo.userPhoto}
                                    alt="user"
                                />
                            </div> :
                            <div className="user-initials-background">
                                <div className="initials-dropdown">{userInitials}</div>
                            </div>
                        }
                        <div className="full-name">
                            <p style={{ "margin": "2px 0 0 2px"}}>{userInfo.fullName}</p>
                            <p style={{ "margin": "2px 0 16px 2px"}}>{userInfo.email}</p>
                        </div>
                    </Link>
                </NavDropdown.Item>
                <NavDropdown.Item as="button">
                    <Link to="/editProfile" className="btn-edit-profile">
                        Edit Profile
					</Link>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as="button" onClick={this.handleLogOut} >
                    <Link to="/" className="btn-logout">
                        Logout
                    </Link>
                </NavDropdown.Item>
            </NavDropdown>
        )
    }
}

const ObserverDropdownToLogOut = observer(DropdownToLogOut);

export default ObserverDropdownToLogOut;