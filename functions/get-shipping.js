const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const api = new WooCommerceRestApi({
	url: "https://nextcontent.a2hosted.com",
	consumerKey: "ck_d2310fb89d4b548cb7b5b5a86e82eeeb5fb0937a",
	consumerSecret: "cs_6bea21e4c910a37e3768b4401eb5ea409937b8c7",
	version: "wc/v3"
});

const getShippingInfo = async zoneId => {
	const shippingMethods = await api.get(`shipping/zones/${zoneId}/methods`);

	if (shippingMethods.data) {
		if (shippingMethods.data.length) {
			return shippingMethods.data;
		}
	} else {
		return null;
	}
};

exports.handler = async (event, context) => {
	const body = JSON.parse(event.body);
	const targetCountry = body.country || null;

	if (!targetCountry) {
		return {
			statusCode: 403,
			body: "NO_INPUT"
		};
	}

	const shippingZones = await api.get("shipping/zones");
	let result = "NOT_FOUND";
	let statusCode;

	if (shippingZones.data) {
		console.log(shippingZones.data);
		let found = false;
		await Promise.all(
			shippingZones.data.map(async zone => {
				if (found) {
					return;
				}
				const countries = await api.get(
					`shipping/zones/${zone.id}/locations`
				);
				if (countries && countries.data && countries.data.length) {
					if (
						countries.data.find(
							country => country.code === targetCountry
						)
					) {
						console.log("Country found " + targetCountry);
						found = true;
						shoppingMethods = await getShippingInfo(zone.id);
						console.log(shoppingMethods);
						if (shoppingMethods) {
							result = shoppingMethods;
							statusCode = 200;
						} else {
							statusCode = 200;
						}
					}
				} else {
					statusCode = 200;
				}
			})
		);

		return {
			statusCode: statusCode,
			body: JSON.stringify(result)
		};
	} else {
		return {
			statusCode: 500,
			body: "not good"
		};
	}
};
