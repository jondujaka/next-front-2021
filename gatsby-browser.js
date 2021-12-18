export function onRouteUpdate() {
	if (document) {
		document
			.getElementsByTagName("body")[0]
			.classList.remove("overflow-hidden");
	}
}