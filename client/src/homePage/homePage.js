import React from "react";
import { observer } from "mobx-react";
import { Container } from 'react-bootstrap';
import ProductList from "../productList/productList.js";
import Loader from "../loader/loader.js";
import "./homePage.css";

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoaded: false };
    }

    async loadProducts() {
        const { products, liked } = this.props.store;

        await products.getProducts({});
        liked.getLikedProducts();
        if(this._mounted) this.setState({ isLoaded: true });
    }

    componentDidMount() {
        this._mounted = true;
        this.loadProducts();
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    render() {
        const { products } = this.props.store;
        const displayedProducts = products.list.toJSON();

        if (!this.state.isLoaded) {
			return <Loader />;
        }

        if (!displayedProducts.length) {
            return (
                <h1 style={{ margin: "50px", textAlign: "center" }}>No search result found</h1>
            )
        }

        return (
            <Container className="home-table col-lg-9">
                <ProductList displayedProducts={displayedProducts} store={this.props.store} />
            </Container>
        )
    }
}

const ObserverHomePage = observer(HomePage);

export default ObserverHomePage;