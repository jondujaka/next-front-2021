import React, { useState } from "react";

const CartButton = ({ product, format, classes = "", disabled }) => {
	return (
		<div className="cart-button-wrapper">
			<button disabled className={`cart-button ${classes}`}>
				Add to cart
			</button>
			{/* <span className={showStatus ? 'show' : 'hide'}>{addedStatus}</span> */}
		</div>
	);
};

const capFirst = str => str.charAt(0).toUpperCase() + str.slice(1);

export default CartButton;
