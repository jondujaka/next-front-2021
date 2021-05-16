import React from "react";
import { graphql, Link } from "gatsby";
import LangSwitcher from "../components/LangSwitcher";
import Layout from "../components/layout";

const Edition = ({ data, pageContext }) => {
	const { edition, translation, lang, settings } = pageContext;
	const langSlug = translation.language.slug === `en` ? `` : `/sk`;

	let colorStyle;
	if(settings){
		colorStyle = {
			color: settings.textColor,
			backgroundColor: settings.backgroundColor
		};
	}
	
	return (
		<Layout style={colorStyle} year={edition}>
			<div>
				<Link to={`/`}>Main website</Link>
				<h1>
					Edition {edition} - {lang}
				</h1>
				<Link to={`${langSlug}/${edition}`}>Switch language</Link>
			</div>
			<br />
			<h3>All artists</h3>
			<ul>
				{data &&
					data.allArtists.edges.map(artistObj => {
						const { artist } = artistObj;
						return (
							<li key={`artist-${artist.id}`}>
								<Link to={artist.uri}>{artist.title}</Link>
							</li>
						);
					})}
			</ul>
			<h3>All events</h3>
			<ul>
				{data &&
					data.allEvents.edges.map(eventObj => {
						const { event } = eventObj;
						return (
							<li key={`event-${lang}-${event.id}`}>
								<Link to={event.uri}>{event.title}</Link>
							</li>
						);
					})}
			</ul>
		</Layout>
	);
};

const getLangSlug = lang => (lang.slug == `sk` ? `/sk` : ``);

export default Edition;

export const editionQuery = graphql`
	query editionById(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$edition: String
		$lang: String
	) {
		allArtists: allWpArtist(
			filter: {
				editions: {nodes: {elemMatch: {slug: {eq: $edition } } } }
				language: { slug: { eq: $lang } }
			}
		) {
			edges {
				artist: node {
					slug
					title
					id
					uri
					language {
						slug
					}
				}
			}
		}
		allEvents: allWpEvent(
			filter: {
				editions: {nodes: {elemMatch: {slug: {eq: $edition } } } }
				language: { slug: { eq: $lang } }
			}
		) {
			edges {
				event: node {
					slug
					title
					id
					uri
					language {
						slug
					}
				}
			}
		}
	}
`;
