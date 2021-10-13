import { useAppState } from "../components/context";
import Layout from "../components/layout";
import React, { useEffect } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import Row from "../components/row";
import { Link } from "gatsby";
import CartItem from "../components/cart/cartItem";
import { loadStripe } from "@stripe/stripe-js";

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
			return <span className="cart-info">Loading cart...</span>;
		}

		if (loadingMutation) {
			return <span className="cart-info">Updating cart...</span>;
		}

		if (!cart) {
			return <span className="cart-info">Empty cart</span>;
		}

		if (cart?.contents.itemCount === 0) {
			return <span className="cart-info">Empty cart</span>;
		}

		return (
			<>
				{cart?.contents.nodes.map((item, i) => {
					return (
						<CartItem
							item={item}
							key={item.product.node.databaseId}
						/>
					);
				})}
			</>
		);
	};

	const handleFormSubmission = async event => {
		event.preventDefault();

		try {
			const response = await fetch(
				`/.netlify/functions/create-checkout`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ items: cart.contents.nodes })
				}
			).then(res => res.json());

			const stripe = await loadStripe(response.publishableKey);
			const { error } = await stripe.redirectToCheckout({
				sessionId: response.sessionId
			});

			if (error) {
				console.error(error);
			}
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<Layout>
			<Row classes="mt-5 mb-5">
				<div className="col-12 d-none d-lg-block col-md-5 col-xl-6 about-nav">
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
				<div className="col col-12 col-md-7 col-xl-6">
					<CartContent />
					{cart ? (
						<div className="checkout-info">
							<h4>Subtotal {cart.subtotal}</h4>
							<h4>Shipping {cart.shippingTotal}</h4>
							<h4 className="total">TOTAL {cart.total}</h4>
						</div>
					) : (
						``
					)}
					<a
						href="#"
						className="checkout-btn"
						onClick={handleFormSubmission}
					>
						Checkout
					</a>
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
						uri
						product {
							node {
								name
								sku
								databaseId
								... on SimpleProduct {
									price
								}
								... on VariableProduct {
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

export default Cart;
