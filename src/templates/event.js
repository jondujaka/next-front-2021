import React from "react";
import { graphql, Link } from "gatsby";
import LangSwitcher from "../components/LangSwitcher";
import Layout from "../components/layout";

const Events = ({ data: { event }, pageContext }) => {
	console.log(pageContext);
	const {settings, edition } = pageContext;

	let langTo = event.language.slug == `sk` ? `` : `/sk`;
	return (
		<Layout settings={settings}>
			<h1>{event.title}</h1>
			<LangSwitcher 
				link={`/${edition}${langTo}/event/${event.translations[0].slug}`}
				text="Switch Language"
			/>
		</Layout>
	);
};

export default Events;

export const eventQuery = graphql`
	query eventById(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$id: String!
	) {
		# selecting the current post by id
		event: wpEvent(id: { eq: $id }) {
			id
			title
			language {
				slug
			}
			translations {
				slug
				uri
			}
		}
	}
`;
