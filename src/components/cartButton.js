import React, { useState } from "react";

const CartButton = ({ product, format, classes = "", disabled }) => {
	console.log(product);

	return (
		<div className="cart-button-wrapper">
			<button
				className={`snipcart-add-item cart-button ${classes}`}
				data-item-id={`${product.databaseId}${
					format && format.format !== 'default' ? `-${format.format}` : ``
				}`}
				data-item-image={product.featuredImage.node.sourceUrl}
				data-item-format={format.format}
				data-item-price={format.price || 0}
				data-item-file-guid={format.downloadId}
				data-item-url={`https://a01d-77-250-254-148.ngrok.io${product.uri}`}
				data-item-name={`${product.title} - ${product.productInfo.subtitle}${
					format && format.format !== 'default' ? ` (${capFirst(format.format)})` : ``
				}`}
				data-item-weight={format.weight}
			>
				Add to cart
			</button>
			{/* <span className={showStatus ? 'show' : 'hide'}>{addedStatus}</span> */}
		</div>
	);
};

const capFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default CartButton;
