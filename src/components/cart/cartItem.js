import React from "react";
import { Link } from "gatsby";	

const CartItem = ({ item }) => {
	
	const productInfo = item.variation ? item.variation.node : item.product.node;
	const image = item.product.node.featuredImage.node.srcSet;
	const url = item.product.node.uri;
	const name = item.product.node.name;
	const subtitle = item.product.node.productInfo.subtitle;
	
	return (
		<Link to={url} className="cart-item">
			<div className="cart-image-wrapper">
				<img srcSet={image} />
			</div>

			<div className="cart-item-info">
				<h3>
					{name} 
				</h3>
				<h3>{subtitle}</h3>
				<span className="mt-4 d-block quantity">
					Quantity: {item.quantity}
				</span>
				<h4 className="price">
					<span>{productInfo.price}</span>
					<span>BTW (21%) inc.</span>
				</h4>
			</div>
		</Link>
	);
};

export default CartItem;
