import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import ProductsGrid from "../components/blockGrids/productsGrid";

const Records = ({ data, pageContext }) => {
	const records = data.records.edges;
	const { latestEdition } = pageContext;

	const langSlug = pageContext.lang === `en` ? `sk/` : ``;
	const isSk = pageContext.lang !== `en`;
	const translationSlug = `/${langSlug}records`;

	const filteredRecords = records.filter(record => {
		const isSkRecord = record.node.uri.startsWith("/sk/");
		return isSk ? isSkRecord : !isSkRecord;
	});

	return (
		<Layout
			isSk={isSk}
			translationSlug={translationSlug}
			style={latestEdition}
		>
			<Row>
				<div className="col col-12 mt-5 mb-6">
					<h2 className="festival-page-title">{data.page.title}</h2>
				</div>
				<ProductsGrid items={records} />
			</Row>
		</Layout>
	);
};

export default Records;

export const recordsQuery = graphql`
	query allRecords(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$id: String
	) {
		records: allWpSnipproduct(
			sort: { order: DESC, fields: date }
			filter: {
				snipcategories: {
					nodes: { elemMatch: { slug: { eq: "records" } } }
				}
			}
		) {
			edges {
				node {
					date(formatString: "MMM Do YYYY")
					slug
					databaseId
					title
					uri
					featuredImage {
						node {
							srcSet
						}
					}
					productInfo {
						subtitle
						variations {
							format
						}
					}
				}
			}
		}
		page: wpPage(id: { eq: $id }) {
			id
			title
		}
	}
`;
