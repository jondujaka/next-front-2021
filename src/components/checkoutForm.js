import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { gql, useMutation } from "@apollo/client";
import { navigate } from "gatsby";
import { useAppState } from "./context";

import Layout from "./layout";

const CheckoutForm = () => {
	const [formState, setFormState] = useState("IDLE");

	const { setCart } = useAppState();
	const stripe = useStripe();
	const elements = useElements();

	const [checkout] = useMutation(CHECKOUT, {
		onCompleted({ checkout }) {
			handleSuccessfulCheckout({ order: checkout.order });
		},
		onError(error) {
			console.error(error);
			setFormState("ERROR");
		}
	});

	const handleSubmit = async event => {
		event.preventDefault();
		setFormState("LOADING");
		try {
			const source = await handleStripe();

			await checkout({
				variables: {
					input: {
						clientMutationId: "12345",
						paymentMethod: "stripe",
						shippingMethod: "Flat rate",
						billing: {
							firstName: "George",
							lastName: "Costanza",
							address1: `129 West 81st Street, Apartment 5A`,
							city: `New York`,
							state: `NY`,
							postcode: `12345`,
							email: `jdujaka@gmail.com`
						},
						metaData: [
							{
								key: `_stripe_source_id`,
								value: source.id
							}
						]
					}
				}
			});
		} catch (error) {
			console.error(error);
		}
	};

	async function handleStripe() {
		if (!stripe || !elements) {
			throw Error(`stripe or elements undefined`);
		}

		const cardElements = elements.getElement(CardElement);

		if (!cardElements) {
			throw Error(`Card elements not found`);
		}

		const { source, error: sourceError } = await stripe.createSource(
			cardElements,
			{
				type: "card"
			}
		);

		if (sourceError || !source) {
			throw Error(
				sourceError?.message || `Unknown error generating source`
			);
		}

		return source;
	}

	function handleSuccessfulCheckout({ order }){
		setFormState("IDLE");
		localStorage.removeItem("woo-session");
		setCart(undefined);
		navigate("/order-received", { state: order });
	}

	return (
		<Layout>
			<h1>Checkout</h1>
			<form onSubmit={handleSubmit}>
				<CardElement
					options={{
						hidePostalCode: true,
						style: { base: { fontSize: `18px` } }
					}}
				/>
				<button
					type="submit"
				>
					Pay
				</button>
			</form>
		</Layout>
	);
};

export default CheckoutForm;

const CHECKOUT = gql`
	mutation Checkout($input: CheckoutInput!) {
		checkout(input: $input) {
			order {
				databaseId
				orderNumber
				total
				downloadableItems {
					edges {
						node {
							name
							url
						}
					}
				}
				lineItems {
					nodes {
						product {
							name
							databaseId
						}
					}
				}
			}
		}
	}
`;
