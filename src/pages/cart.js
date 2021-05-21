import { useAppState } from "../components/context";
import Layout from "../components/Layout";
import React, { useEffect } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { Link } from "gatsby";

const Cart = () => {
	const { cart, setCart } = useAppState();
	const [maybeGetCart, { loading }] = useLazyQuery(CART, {
		onCompleted: ({ cart }) => {
			setCart(cart);
		}
	});

	const [removeAllItems, { loading: loadingMutation }] = useMutation(REMOVE, {
		onCompleted() {
			setCart(undefined);
		},
		update(cache) {
			cache.writeQuery({
				query: CART,
				data: undefined
			});
		}
	});

	useEffect(() => {
		if (cart) {
			return;
		}

		maybeGetCart();
	}, [cart, maybeGetCart]);

	if (loading) {
		return (
			<Layout>
				<span>Loading cart...</span>
			</Layout>
		);
	}

	if (loadingMutation) {
		return (
			<Layout>
				<span>Updating cart...</span>
			</Layout>
		);
	}

	if (!cart) {
		return (
			<Layout>
				<span>Empty cart</span>
			</Layout>
		);
	}

	if (cart?.contents.itemCount === 0) {
		return (
			<Layout>
				<span>Empty cart</span>
			</Layout>
		);
	}

	return (
		<Layout>
			<h1>Cart</h1>
			<h2>Items</h2>
			{cart?.contents.nodes.map((item, i) => {
				const { node } = item.product;
				return <div key={`item-${node.databaseId}-${i}`}>{node.name}</div>;
			})}
			<div my={6}>
				<h3>Summary</h3>
				<div>Subtotal: {cart.subtotal}</div>
				<div>Shipping: {cart.shippingTotal}</div>
				<div>Total: {cart.total}</div>
			</div>
			<div>
				<Link to="/checkout">Checkout</Link>
				<button
					onClick={() =>
						removeAllItems({
							variables: {
								input: {
									clientMutationId: `1234`,
									all: true
								}
							}
						})
					}
				>
					Remove all
				</button>
			</div>
		</Layout>
	);
};

const REMOVE = gql`
	mutation RemoveItemFromCart($input: RemoveItemsFromCartInput!) {
		removeItemsFromCart(input: $input) {
			cart {
				subtotal
				total
				shippingTotal
				contents {
					itemCount
					nodes {
						quantity
						key
						product {
							node {
								name
								sku
								databaseId
								... on SimpleProduct {
									price
								}
							}
						}
					}
				}
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
					key
					product {
						node {
							name
							sku
							databaseId
							... on SimpleProduct {
								price
							}
						}
					}
				}
			}
		}
	}
`;

export default Cart;
