import React from "react";
import { Link } from "gatsby";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Layout from "../components/layout";
import Row from "../components/row";
import CheckoutForm from "../components/checkoutForm";

const stripePromise = loadStripe(
	`pk_test_51ItELBL8YiD5HzFxeeCPXL29wyfB6NjKMU29wViwhXdfYn2jl3XcS0mxnjSs45X4eEN31F1T59WqRFa8Qnd5DL3Q00A3nhTsGt`
);

const Checkout = () => {
	return (
		<Layout>
			<Row classes="mt-5 mb-5">
				<div className="col-12 d-none d-lg-block col-md-5 col-xl-6 about-nav">
					<ul>
						<li>
							<Link to="/cart" className="hollow-link">
								Cart Summary
							</Link>
						</li>
						<li  className="active">
							<Link to="/checkout" className="hollow-link">
								Checkout
							</Link>
						</li>
					</ul>
				</div>
				<div className="col col-12 col-md-7 col-xl-6">
					<Elements stripe={stripePromise}>
						<CheckoutForm />
					</Elements>
				</div>
			</Row>
		</Layout>
	);
};

export default Checkout;
