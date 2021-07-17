import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import ArtistsGrid from "../components/blockGrids/artistsGrid";

const ArtistsTemplate = ({ data, pageContext }) => {
	const artistsList = data.artists.edges;
	const { settings, edition, menu } = pageContext;
	console.log(data);

	return (
		<Layout
			style={{
				color: settings.textColor,
				backgroundColor: settings.backgroundColor
			}}
			editionHeader={menu}
			year={edition}
		>
			<Row>
				<div className="col col-12 px-0">
					<h1 className="normal-line-height fw-title border-bottom-thick">Artists</h1>
				</div>
			</Row>
			<Row classes="mt-6 justify-content-start">
				{artistsList && <ArtistsGrid items={artistsList} />}
			</Row>
		</Layout>
	);
};

export default ArtistsTemplate;

export const artistsQuery = graphql`
	query artistsPage($edition: String!) {
		artists: allWpArtist(
			sort: { order: DESC, fields: date }
			filter: {
				editions: { nodes: { elemMatch: { slug: { eq: $edition } } } }
			}
		) {
			edges {
				node {
					id
					slug
					uri
					title
					language {
						slug
					}
					featuredImage {
						node {
							sizes
							uri
							description
							caption
							mediaDetails {
								sizes {
									name
									sourceUrl
								}
							}
						}
					}
				}
			}
		}
	}
`;
