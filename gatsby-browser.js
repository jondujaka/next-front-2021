import React from "react";
import { ApolloProvider } from "react-apollo";
import { client } from "./src/apollo/client";
import { AppProvider } from "./src/components/context";

export function wrapRootElement({ element }) {
	return (
		<ApolloProvider client={client}>
			{element}
		</ApolloProvider>
	);
}
