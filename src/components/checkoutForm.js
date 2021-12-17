import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { gql, useMutation } from "@apollo/client";
import axios from 'axios'
import { navigate } from "gatsby";
import { useAppState } from "./context";
import countries from "../utils/countries";
import Layout from "./layout";
import { useForm } from "react-hook-form";

const CheckoutForm = () => {
	const [formStateCart, setFormStateCart] = useState("IDLE");
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isDirty, isValid }
	} = useForm({ mode: "onBlur" });

	const [loading, setLoading] = useState(false);
	const [shippingVal, setShippingVal] = useState(false);

	const { setCart } = useAppState();
	const stripe = useStripe();
	const elements = useElements();

	const [checkout] = useMutation(CHECKOUT, {
		onCompleted({ checkout }) {
			handleSuccessfulCheckout({ order: checkout.order });
		},
		onError(error) {
			console.error(error);
			setFormStateCart("ERROR");
		}
	});

	const onSubmit = async () => {
		// event.preventDefault();
		setFormStateCart("LOADING");
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

	function handleSuccessfulCheckout({ order }) {
		setFormStateCart("IDLE");
		localStorage.removeItem("woo-session");
		setCart(undefined);
		navigate("/order-received", { state: order });
	}

	const calculateShipping = async (ev) => {
		
		let countryCode = ev.target.value;
		if(countryCode){
			setLoading(true);
			const result = await axios.post(`http://localhost:8888/.netlify/functions/get-shipping`, {
				country: countryCode
			});

			if(result.data && result.data.length && result.data !== 'NOT_FOUND'){
				const value = result.data[0].settings.cost.value;
				setShippingVal(value);
			} else {
				setShippingVal(false);
			}
			setLoading(false);
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<h3>Your details</h3>

			<div className="form-element">
				<label>Full name</label>
				<input
					type="text"
					{...register("name", {
						required: "Name is required"
					})}
				/>
				<span className="error">{errors.name?.message}</span>
			</div>

			<div className="form-element">
				<label>Email</label>
				<input
					type="email"
					{...register("email", {
						required: true,
						pattern: {
							value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
							message: "invalid email address"
						}
					})}
				/>
				<span className="error">{errors.email?.message}</span>
			</div>

			<div className="form-element">
				<label>Address</label>
				<input
					type="text"
					{...register("address", { required: 'Address is required' })}
				/>
				<span className="error">{errors.address?.message}</span>
			</div>

			<div className="form-element">
				<label>City</label>
				<input type="text" {...register("city", { required: "City is required" })} />
				<span className="error">{errors.city?.message}</span>
			</div>

			<div className="form-element">
				<label>Postcode</label>
				<input
					type="text"
					{...register("postcode", { required: "Postcode is required" })}
				/>
				<span className="error">{errors.postcode?.message}</span>
			</div>

			<div className="form-element">
				<label>State (Optional)</label>
				<input type="text" {...register("state")} />
				{/* <span className="error">{errors.state?.message}</span> */}
			</div>

			<div className="form-element">
				<label>Country</label>
				<select  {...register("country", { required: "Country is required", onChange: (e) => calculateShipping(e) })}>
					<option value="">Select a country</option>
					{Object.keys(countries).map(key => (
						<option value={key}>{countries[key]}</option>
					))}
				</select>
				<span className="error">{errors.country?.message}</span>
			</div>

			<h3 className="mt-6">Payment details</h3>

			<CardElement
				className="card-element"
				options={{
					hidePostalCode: true,
					style: { base: { fontSize: `18px` } }
				}}
			/>

			<div className="checkout-total">
				Subtotal: <b>400Eur</b>
				<br />
				Shipping: {shippingVal && <b>{shippingVal}Eur</b>}
				<br />
				TOTAL: <b>415Eur</b>
			</div>

			<button
				disabled={!isDirty || !isValid || !shippingVal || loading}
				className="checkout-btn mt-6"
				type="submit"
			>
				{!loading ? 'Complete Payment' : 'Loading' }
			</button>
		</form>
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
