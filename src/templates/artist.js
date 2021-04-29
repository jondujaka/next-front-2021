import React from "react";
import { graphql, Link } from "gatsby";
import LangSwitcher from "../components/LangSwitcher";
import Layout from "../components/layout";

const Artist = ({ data: { artist }, pageContext }) => {
	const {edition, settings} = pageContext;

	let langTo = artist.language.slug == `sk` ? `` : `/sk`;
	return (
		<Layout settings={settings}>
			<h1>{artist.title}</h1>
			<LangSwitcher 
				link={`/${edition}${langTo}/artist/${artist.translations[0].slug}`}
				text="Switch Language"
			/>
		</Layout>
	);
};

export default Artist;

export const artistQuery = graphql`
	query artistById(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$id: String!
	) {
		# selecting the current post by id
		artist: wpArtist(id: { eq: $id }) {
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
