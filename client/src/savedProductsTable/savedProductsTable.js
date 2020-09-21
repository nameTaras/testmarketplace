import React from "react";
import { observer } from "mobx-react";
import { Container } from 'react-bootstrap';
import ProductList from "../productList/productList.js";
import Loader from "../loader/loader.js";
import "./savedProductsTable.css";

class SavedProductsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoaded: false };

        this.loadProducts = this.loadProducts.bind(this);
    }

    async loadProducts() {
        await this.props.store.liked.getLikedProducts();
        this.setState({ isLoaded: true });
    }

    componentDidMount() {
        this.loadProducts();
    }

    render() {
        const { liked } = this.props.store;
        const displayedProducts = liked.list.toJSON();

        if (!this.state.isLoaded) {
            return <Loader />;
        }

        return (
            <Container className="saved-products-table col-lg-9">
                <p className="num-saved-products">SAVED ITEMS ({displayedProducts.length})</p>
                <ProductList displayedProducts={displayedProducts} store={this.props.store} />
            </Container>
        )
    }
}

const ObserverSavedProductsTable = observer(SavedProductsTable);

export default ObserverSavedProductsTable;