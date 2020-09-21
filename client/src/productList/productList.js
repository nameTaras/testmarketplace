import React from 'react';
import { Container } from 'react-bootstrap';
import ProductItem from "../productItem/productItem.js";
import "./productList.css";

export default (props) => {
    let listCol = [];
    props.displayedProducts.forEach(product => {
        listCol.push(
            <ProductItem key={product._id} productData={product} store={props.store} />
        );
    });

    return (
        <Container className="container-product-table">
            {listCol}
        </Container>
    )
}