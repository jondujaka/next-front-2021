import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import ArtistsGrid from "../components/blockGrids/artistsGrid";

const ArtistsTemplate = ({ data, pageContext }) => {
	const artistsList = data.artists.edges;
	const { settings, edition } = pageContext;
	console.log(data);

	return (
		<Layout
			style={{
				color: settings.textColor,
				backgroundColor: settings.backgroundColor
			}}
			year={edition}
		>
			<Row>
				<div className="col col-12">
					<h2>Artists</h2>
				</div>
			</Row>
			<Row classes="mt-6 justify-content-center">
				{artistsList && <ArtistsGrid items={artistsList} />}
			</Row>
		</Layout>
	);
};

export default ArtistsTemplate;

export const artistsQuery = graphql`
	query artistsPage {
		artists: allWpArtist(sort: { order: DESC, fields: date }) {
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
