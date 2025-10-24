export function onRouteUpdate() {
	if (document) {
		document
			.getElementsByTagName("body")[0]
			.classList.remove("overflow-hidden");
	}

	if (process.env.CONTEXT === 'production' && window.fbq && typeof window.fbq === `function`) {
		console.log('test')
		window.fbq("track", "ViewContent");
	}
}
