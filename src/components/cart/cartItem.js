import React from "react";
import { Link } from "gatsby";
import Image from "../image";

const CartItem = ({ item }) => {
	console.log(item);
	const productInfo = item.product.node;
	const varInfo = item.variation.node;

	let attribute = varInfo.attributes.nodes.find(atr => atr.name === `format`);
	return (
		<div className="cart-item">
			<Image srcSet={productInfo.featuredImage.node.srcSet} />

			<div className="cart-item-info">
				<h3>
					{productInfo.name} ({attribute.value})
				</h3>
				<h3>{productInfo.productInfo.subtitle}</h3>
				<span className="mt-2 d-block quantity">
					Quantity - {item.quantity} +
				</span>
				<h4 className="price">
					<span>{varInfo.price}</span>
					<span>BTW (21%) inc.</span>
				</h4>
			</div>
		</div>
	);
};

export default CartItem;
