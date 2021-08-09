import React from "react";

import { useMutation, gql } from "@apollo/client";
import { useAppState } from "./context";

const CartButton = ({ text, productId, classes = "" }) => {
	const { setCart } = useAppState();

	const [addToCart, { loading }] = useMutation(ADD_TO_CART, {
		onCompleted: ({ addToCart }) => {
			setCart(addToCart.cart);
		},
		onError: () => {
			console.log("ERROR");
		}
	});

	function handleAddToCart() {
		addToCart({
			variables: {
				input: { productId, quantity: 1, clientMutationId: "123" }
			}
		});
	}

	return (
		<button
			onClick={() => handleAddToCart()}
			className={`cart-button ${classes}`}
		>
			{text}
		</button>
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
