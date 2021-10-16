/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/ssr-apis/
 */

// You can delete this file if you're not using it

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