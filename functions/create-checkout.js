const stripe = require("stripe")(
	`sk_test_51Jc3tgBsU5VsdqsSVVwTGzG5aVdTWzvro1azBZhUdkrKxdpi6HtY9B9ZalEYvnr0BvqJ8L2g0arVjS2PI9I51Cqf00Ei9jX6A6`
);

exports.handler = async event => {
	// const { sku, quantity } = JSON.parse(event.body);
	// const product = inventory.find(p => p.sku === sku);
	// const validatedQuantity = quantity > 0 && quantity < 11 ? quantity : 1;

	const incomingItems = JSON.parse(event.body).items;

	const items = incomingItems.map(item => {
		const isVariation = item.variation ?? false;

		const price = isVariation
			? item.variation.node.price
			: item.product.node.price;

		return {
			price_data: {
				currency: "eur",
				product_data: {
					name: item.product.node.name,
					id: item.product.node.databseId,
					images: [item.product.node.featuredImage.node.sourceUrl]
				},
				unit_amount: Number(price.substring(1)) * 100
			},

			quantity: item.quantity
		};
	});

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		line_items: items,
		mode: "payment",
		success_url: `${process.env.URL}/order-received?clearCart=true`,
		cancel_url: `${process.env.URL}/cart`
	});

	console.log(session);

	return {
		statusCode: 200,
		body: JSON.stringify({
			sessionId: session.id,
			url: session.url,
			publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
		})
	};
};
