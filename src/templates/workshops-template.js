import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import ArtistsGrid from "../components/blockGrids/artistsGrid";

const WorkshopsTemplate = ({ data, pageContext }) => {
	// if (!data.workshops) {
	// 	return <h1>No workshops yet</h1>;
	// }
	const workshopsList = data.workshops.edges;
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
					<h1 className="normal-line-height fw-title border-bottom-thick">Workshops</h1>
				</div>
			</Row>
			<Row classes="mt-6 justify-content-center">
				{workshopsList && <ArtistsGrid items={workshopsList} />}
			</Row>
		</Layout>
	);
};

export default WorkshopsTemplate;

export const workshopsQuery = graphql`
	query workshopsPage {
		workshops: allWpWorkshop(sort: { order: DESC, fields: date }) {
			edges {
				node {
					id
					slug
					uri
					title
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
