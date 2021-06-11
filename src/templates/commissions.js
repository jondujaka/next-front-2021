import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import CommissionsGrid from "../components/blockGrids/commissionsGrid";
import Masonry from "react-masonry-css";

const Commissions = ({ data, pageContext }) => {
	const coms = data.commissions.edges;

	let fake = [];

	for (let i = 0; i < 20; i++) {
		fake.push(coms[1]);
	}

	return (
		<Layout>
			<Row>
				<div className="col col-12">
					<h2>Commissions</h2>
				</div>
			</Row>
			<Row classes="mt-6 justify-content-center">
				{coms && <CommissionsGrid items={fake} />}
			</Row>
		</Layout>
	);
};

export default Commissions;

export const commissionsQuery = graphql`
	query commissionsPage(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$lang: String!
	) {
		commissions: allWpCommission(
			filter: { language: { slug: { eq: $lang } } }
			sort: { order: DESC, fields: date }
		) {
			edges {
				node {
					date(formatString: "MMM Do YYYY")
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