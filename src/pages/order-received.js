import React, { useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useAppState } from "../components/context";

import Layout from "../components/layout";
import Row from "../components/row";

const OrderRecieved = () => {
	const { cart, setCart } = useAppState();
	useEffect(() => {
		if (cart) {
			clearCart({
				variables: {
				  input: {
					clientMutationId: 'asdfasdf',
					all: true,
				  },
				},
			  });
		}
	}, []);

	const { data, refetch } = useQuery(CART, {
		notifyOnNetworkStatusChange: true,
		onCompleted: () => {
		  // console.warn( 'completed GET_CART', data );
	
		  // Update cart in the localStorage.
		  localStorage.setItem("woo-next-cart", JSON.stringify(data));
	
		  // Update cart data in React Context.
		  setCart(data);
		},
	  });

	const [clearCart, { loading: clearCartProcessing }] = useMutation(
		CLEAR_CART_MUTATION,
		{
			onCompleted: () => {
				refetch();
			},
			onError: error => {
				if (error) {
					console.error(error);
				}
			}
		}
	);
	return (
		<Layout>
			<Row>
				<div className="col-12">
					<h1>Order recieved</h1>
				</div>
				<div className="col-12">
					<h4>
						Thank you for your order. We have received your order,
						and will update you
					</h4>
				</div>
			</Row>
		</Layout>
	);
};

const CLEAR_CART_MUTATION = gql`
	mutation CLEAR_CART_MUTATION($input: RemoveItemsFromCartInput!) {
		removeItemsFromCart(input: $input) {
			cartItems {
				quantity
			}
		}
	}
`;

const CART = gql`
	query Cart {
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
										sourceUrl
									}
								}
								productInfo {
									subtitle
								}
							}
							... on SimpleProduct {
								featuredImage {
									node {
										srcSet
										sourceUrl
									}
								}
								uri
								price
								productInfo {
									subtitle
								}
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
`;

export default OrderRecieved;
