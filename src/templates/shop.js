import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import ProductsGrid from "../components/blockGrids/productsGrid";

const Shop = ({ data, pageContext }) => {
	const products = data.products.edges;
	const { latestEdition } = pageContext;

	const langSlug = pageContext.lang === `en` ? `sk/` : ``;
	const isSk = pageContext.lang !== `en`;
	const translationSlug = `/${langSlug}shop`;

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
				<ProductsGrid items={products} />
			</Row>
		</Layout>
	);
};

export default Shop;

export const shopQuery = graphql`
	query allProducts(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$id: String
	) {
		products: allWpSnipproduct(sort: { order: DESC, fields: date }) {
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
