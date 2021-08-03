import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import ProductsGrid from "../components/blockGrids/productsGrid";

const Records = ({ data, pageContext }) => {
	console.log(data);
	const records = data.records.edges;

	const langSlug = pageContext.lang === `en` ? `sk/` : ``;
	const isSk = pageContext.lang !== `en`;
	const translationSlug = `/${langSlug}records`;

	return (
		<Layout isSk={isSk} translationSlug={translationSlug}>
			<Row classes="mt-6">
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
		records: allWpProduct(
			sort: { order: DESC, fields: date }
			filter: {
				productCategories: {
					nodes: { elemMatch: { slug: { eq: "records" } } }
				}
			}
		) {
			edges {
				node {
					date(formatString: "MMM Do YYYY")
					slug
					... on WpVariableProduct {
						id
						name
						uri
						name
						productInfo {
							subtitle
						}
						featuredImage {
							node {
								srcSet
							}
						}
						variations {
							nodes {
								name
								nodeType
								attributes {
									nodes {
										value
									}
								}
							}
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
