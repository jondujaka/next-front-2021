import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Layout from "../components/layout";
import CheckoutForm from "../components/checkoutForm";

const stripePromise = loadStripe(`pk_test_51ItELBL8YiD5HzFxeeCPXL29wyfB6NjKMU29wViwhXdfYn2jl3XcS0mxnjSs45X4eEN31F1T59WqRFa8Qnd5DL3Q00A3nhTsGt`);

const Checkout = () => {
	return (
		<Layout>
			<h1>Checkout</h1>
			<Elements stripe={stripePromise}>
				<CheckoutForm />
			</Elements>
		</Layout>
	);
};

export default Checkout;
