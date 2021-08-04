import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import Carousel from "../components/carousel";
import CartButton from "../components/cartButton";
import Single from "./single.js";

const Product = ({ data, pageContext }) => {
	const product = data.product;
	const carouselItems = product.productInfo.images;

	console.log(product);

	return (
		<Layout>
			<Row>
				<div className="col col-12 mt-5 mb-6">
					<h2 className="festival-page-title">
						<Link className="inherit" to="/news">
							Shop
						</Link>
						{` > ${product.name}`}
					</h2>
				</div>
			</Row>
			<Row classes="mt-6">
				<div className="col col-12 col-lg-6 product-carousel">
					{carouselItems.length && <Carousel items={carouselItems} />}
				</div>
				<div className="col col-12 col-lg-6">
					<h2>{product.name}</h2>
					<h3 className="product-subtitle">
						{product.productInfo.subtitle}
					</h3>
					<div className="formats">
						{product.variations ? (
							product.variations.nodes.map(format => {
								return <ProductInfo format={format} />;
							})
						) : (
							<ProductInfo format={product} />
						)}
					</div>
					<Single content={product} direct={true} />
				</div>
			</Row>
		</Layout>
	);
};

const ProductInfo = ({ format }) => (
	<div key={`format-${format.price}`} className="format mb-4">
		{format.price && <span>{format.price}</span>}
		{format.attributes && <span>{format.attributes.nodes[0].value}</span>}
		<CartButton
			productId={format.databaseId}
			classes="ml-4"
			text="Add to cart"
		/>
	</div>
);

export default Product;

export const productQuery = graphql`
	query productById(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$id: String!
	) {
		# selecting the current post by id
		product: wpProduct(id: { eq: $id }) {
			id
			name
			... on WpSimpleProduct {
				id
				name
				databaseId
				productInfo {
					fieldGroupName
					subtitle
					images {
						srcSet
					}
				}
				price
				slug
				nodeType
				downloadable
				databaseId
			}
			... on WpVariableProduct {
				id
				name
				databaseId
				productInfo {
					fieldGroupName
					subtitle
					images {
						srcSet
					}
				}
				variations {
					nodes {
						name
						price
						slug
						type
						nodeType
						downloadable
						databaseId
						attributes {
							nodes {
								name
								value
							}
						}
					}
				}
			}
		}
	}
`;
