import { useAppState } from "../components/context";
import Layout from "../components/layout";
import React, { useEffect } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import Row from "../components/row";
import { Link } from "gatsby";
import CartItem from "../components/cart/cartItem";

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

	const CartContent = ({}) => {
		if (loading) {
			return <span>Loading cart...</span>;
		}

		if (loadingMutation) {
			return <span>Updating cart...</span>;
		}

		if (!cart) {
			return <span>Empty cart</span>;
		}

		if (cart?.contents.itemCount === 0) {
			return <span>Empty cart</span>;
		}

		return (
			<>
				{cart?.contents.nodes.map((item, i) => {
					return <CartItem item={item} key={item.product.node.databaseId} />;
				})}
			</>
		);
	};

	return (
		<Layout>
			<Row classes="mt-6">
				<div className="col-12 d-none d-lg-block col-lg-6 col-xl-6 about-nav">
					<ul>
						<li className="active">
							<Link to="/cart" className="hollow-link">
								Cart Summary
							</Link>
						</li>
						<li>
							<Link to="/checkout" className="hollow-link">
								Checkout
							</Link>
						</li>
					</ul>
				</div>
				<div className="col col-12 col-lg-6">
					<CartContent />
					{cart ? (
						<div className="checkout-info">
							<h4>Subtotal {cart.subtotal}</h4>
							<h4>Shipping {cart.shippingTotal}</h4>
							<h4>TOTAL {cart.total}</h4>
						</div>
					) : (
						``
					)}
					<Link className="checkout-btn" to="/checkout">Checkout</Link>
				</div>
			</Row>
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
					product {
						node {
							name
							sku
							databaseId
							featuredImage {
								node {
									srcSet
								}
							}
							... on VariableProduct {
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

export default Cart;
