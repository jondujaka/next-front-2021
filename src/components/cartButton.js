import React, { useState } from "react";


const CartButton = ({ product, format, classes = "", disabled }) => {

	console.log(product);

	return (
		<div className="cart-button-wrapper">
			<button
				className={`snipcart-add-item cart-button ${classes}`}
				// disabled={disabled}
				// title={disabled ? `Out of stock` : `Add to cart`}
				data-item-id={`124123123`}
				data-item-price={44}
				data-item-url="https://fd95-77-250-254-148.ngrok.io/products/plus"
				data-item-name={`Title here`}
			>
				Add to cart
			</button>
			{/* <span className={showStatus ? 'show' : 'hide'}>{addedStatus}</span> */}
		</div>
	);
};

export default CartButton;
