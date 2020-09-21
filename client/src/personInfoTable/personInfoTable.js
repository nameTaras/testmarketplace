import React from "react";
import { Container } from 'react-bootstrap';
import { observer } from "mobx-react";
import { withRouter } from 'react-router-dom';
import ProductList from "../productList/productList.js";
import Loader from "../loader/loader.js";
import "./personInfoTable.css";

class PersonInfoTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            feedbackSelected: false,
            salesSelected: false,
            activeSelected: true,
            isLoaded: false
        };
    }

    async loadProducts() {
        const { products, liked, users } = this.props.store;
        const ownerId = this.props.history.location.search.split('=')[1];
        const userResponse = await users.getUser(ownerId);
        const user = await userResponse.json();

        await products.getProducts({ ownerId: user._id });
        this.setState({ isLoaded: true });
        await liked.getLikedProducts();
    }

    componentDidMount() {
        this.loadProducts();
    }

    render() {
        const { feedbackSelected, salesSelected, activeSelected } = this.state;
        const ownerId = this.props.history.location.search.split('=')[1];
        const userInfo = this.props.store.users.getStoresUser(ownerId);
        const userInitials = userInfo.fullName.split(" ").map(item => item[0]).join("");
        const displayedProducts = this.props.store.products.listById.toJSON();

        return (
            <Container className="person-info-table col-lg-9">
                <Container className="wrapper-photo">
                    {userInfo.userPhoto ?
                        <>
                            <img
                                className="user-photo"
                                src={userInfo.userPhoto}
                                alt="user" />
                            <p className="person-info-table-full-name">{userInfo.fullName}</p>
                        </> :
                        <>
                            <div className="edit-profile-user-initials-background">
                                <div className="edit-profile-initials">{userInitials}</div>
                            </div>
                            <p className="person-info-table-full-name">{userInfo.fullName}</p>
                        </>
                    }
                </Container>
                <Container className="work-lists-container">
                    <div
                        className={`work-list ${feedbackSelected ? "selected" : ""}`}>
                        <span style={{ color: "#3CB255" }}>88%</span>
                        <span className="name-list">Person feedback</span>
                    </div>
                    <div className={`work-list ${salesSelected ? "selected" : ""}`}>
                        <span style={{ color: "#349A89" }}>123</span>
                        <span className="name-list">Sales</span>
                    </div>
                    <div className={`work-list ${activeSelected ? "selected" : ""}`}>
                        <span>{displayedProducts.length}</span>
                        <span className="name-list">Active listings</span>
                    </div>
                </Container>
                <ProductList displayedProducts={displayedProducts} store={this.props.store} />
                {this.state.isLoaded || <Loader />}
            </Container>
        )
    }
}

const ObserverPersonInfoTable = observer(PersonInfoTable);

export default withRouter(ObserverPersonInfoTable);