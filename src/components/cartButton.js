import React from "react";

const CartButton = ({ text, callBack, classes="" }) => {
	return <button onClick={() => callBack()} className={`cart-button ${classes}`}>{text}</button>;
};

export default CartButton;
