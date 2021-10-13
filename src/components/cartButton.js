import React, { useState } from "react";

import { useMutation, gql } from "@apollo/client";
import { useAppState } from "./context";

const CartButton = ({ text, productId, classes = "", disabled }) => {
	const { setCart } = useAppState();

	const [addedStatus, setAddedStatus] = useState("");
	const [showStatus, setShowStatus] = useState(false);

	const [addToCart, { loading }] = useMutation(ADD_TO_CART, {
		onCompleted: ({ addToCart }) => {
			setCart(addToCart.cart);
			setAddedStatus("Added");
			startTimer();
		},
		onError: () => {
			console.log("ERROR");
			setAddedStatus("Error");
			startTimer();
		}
	});

	const startTimer = () => {
		setShowStatus(true);
		window.setTimeout(() => {
			setShowStatus(false);
		}, 2000);
	}

	function handleAddToCart() {
		console.log("adding");
		addToCart({
			variables: {
				input: { productId, quantity: 1, clientMutationId: "123" }
			}
		});
	}

	const getText = () => {
		if (loading) {
			return "Adding";
		}
		return text;
	};

	return (
		<div className="cart-button-wrapper">
			<button
				onClick={() => handleAddToCart()}
				className={`cart-button ${classes}`}
				disabled={disabled}
				title={disabled ? `Out of stock` : `Add to cart`}
			>
				{getText()}
			</button>
			<span className={showStatus ? 'show' : 'hide'}>{addedStatus}</span>
		</div>
	);
};

const ADD_TO_CART = gql`
	mutation ATC($input: AddToCartInput!) {
		addToCart(input: $input) {
			cart {
				subtotal
				total
				shippingTotal
				contents {
					itemCount
					nodes {
						quantity
						product {
							node {
								name
								sku
								databaseId
								... on VariableProduct {
									featuredImage {
										node {
											srcSet
										}
									}
									productInfo {
										subtitle
									}
									uri
								}
								... on SimpleProduct {
									price
									featuredImage {
										node {
											srcSet
										}
									}
									productInfo {
										subtitle
									}
									uri
								}
							}
						}
						variation {
							node {
								price
								attributes {
									nodes {
										value
										name
									}
								}
							}
						}
					}
				}
			}
		}
	}
`;

export default CartButton;
