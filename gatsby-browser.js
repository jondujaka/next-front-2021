import React from "react";
import { ApolloProvider } from "@apollo/client";
import { client } from "./src/apollo/client";
import { AppProvider } from "./src/components/context";

export function wrapRootElement({ element }) {
	return (
		<ApolloProvider client={client}>
			<AppProvider>{element}</AppProvider>
		</ApolloProvider>
	);
}

export function onRouteUpdate() {
	if (document) {
		document
			.getElementsByTagName("body")[0]
			.classList.remove("overflow-hidden");
	}
}

export function onRenderBody({ pathname, setHeadComponents }) {
	console.log(pathname);
	if (pathname.includes("get-tickets")) {
		setHeadComponents([
			<script
				key="goout-script"
				type="text/javascript"
				src="https://partners.goout.net/sk-bratislava/nextfestivalsk.js"
			></script>
		]);
	}
}