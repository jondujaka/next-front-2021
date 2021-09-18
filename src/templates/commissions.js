import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import CommissionsGrid from "../components/blockGrids/commissionsGrid";
import Masonry from "react-masonry-css";

const Commissions = ({ data, pageContext }) => {
	const coms = data.commissions.edges;
	const { latestEdition } = pageContext;

	const langSlug = pageContext.lang ===`en` ? `sk/` : ``;
	const isSk = pageContext.lang !== `en`;
	const translationSlug = `/${langSlug}commissions`;

	return (
		<Layout isSk={isSk} translationSlug={translationSlug} style={latestEdition}>
			<Row>
				<div className="col col-12 mt-5 mb-6">
					<h2 className="festival-page-title">{data.page.title}</h2>
				</div>
			</Row>
			<Row classes="justify-content-center">
				{coms && <CommissionsGrid items={coms} />}
			</Row>
		</Layout>
	);
};

export default Commissions;

export const commissionsQuery = graphql`
	query commissionsPage(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$id: String,
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
		page: wpPage(
			id: { eq: $id}
		) {
			id
			title
		}
	}
`;
