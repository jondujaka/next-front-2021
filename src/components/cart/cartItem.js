import React from "react";
import { Link } from "gatsby";

const CartItem = ({ item }) => {
	const productInfo = item.variation
		? item.variation.node
		: item.product.node;
	const image = item.product.node.featuredImage.node.srcSet;
	const url = item.product.node.uri;
	const name = item.product.node.name;
	const subtitle = item.product.node.productInfo.subtitle;

	let format = "";

	if (item.variation) {
		format = productInfo.attributes.nodes[0].value;
	}

	return (
		<Link to={url} className="cart-item">
			<div className="cart-image-wrapper">
				<img srcSet={image} />
			</div>

			<div className="cart-item-info">
				<h2 className="product-page-title">{name}</h2>
				<h2 className="product-subtitle mb-4 mb-lg-6">{subtitle}</h2>
				<span className="mt-4 d-block quantity">
					Quantity: {item.quantity}
				</span>
				{format.length ? (
					<span className="mt-4 d-block quantity">
						Format: {format}
					</span>
				) : (
					""
				)}
				<h4 className="price">
					<span>{productInfo.price}</span>
					<span>BTW (21%) inc.</span>
				</h4>
			</div>
		</Link>
	);
};

export default CartItem;
