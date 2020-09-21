import React from "react";
import './filterBar.css';

import { Form, Col } from 'react-bootstrap'

class FilterBar extends React.Component {
	render() {
		return (
			<Form className="filter-bar">
			  	<Form.Row>
			  		<Col lg="2"></Col>
					<Col lg="4">
				    	<Form.Control as="select">
						    <option>1</option>
						    <option>2</option>
						    <option>3</option>
						    <option>4</option>
						    <option>5</option>
					    </Form.Control>
					</Col>
					<Col lg="2">
			    		<Form.Control type="text" placeholder="Price from (USD)" />
					</Col>
					<Col lg="2">
			    		<Form.Control type="text" placeholder="Price to (USD)" />
	  				</Col>
	  				<Col lg="2"></Col>
				</Form.Row>
			</Form>
		);
	}
}

export default FilterBar;