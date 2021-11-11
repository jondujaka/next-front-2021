import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import Carousel from "../components/carousel";
import CartButton from "../components/cartButton";
import Image from "../components/image";

const Product = ({ data, pageContext }) => {
	const product = data.product;
	const carouselItems = product.productInfo.images;
	const { latestEdition } = pageContext;

	return (
		<Layout style={latestEdition}>
			<Row>
				<div className="col col-12 mt-5 mb-6">
					<h2 className="festival-page-title">
						<Link className="inherit" to="/records">
							Records
						</Link>
						{` > ${product.name}`}
					</h2>
				</div>
			</Row>
			<Row classes="my-6">
				<div className="col col-12 col-lg-6 product-carousel">
					{carouselItems.length > 1 ? (
						<Carousel items={carouselItems} />
					) : (
						<div className="carousel-container">
							<Image srcSet={carouselItems[0].srcSet} />
						</div>
					)}
				</div>
				<div className="col col-12 col-lg-6">
					<h2 className="product-page-title">{product.name}</h2>
					<h3 className="product-subtitle mb-4 mb-lg-6">
						{product.productInfo.subtitle}
					</h3>
					<div className="formats mb-4">
						{product.variations ? (
							product.variations.nodes.map(format => {
								return <ProductInfo format={format} />;
							})
						) : (
							<ProductInfo format={product} />
						)}
					</div>
					<div className="product-description">
						<p
							dangerouslySetInnerHTML={{
								__html: product.description
							}}
						/>
					</div>
					{/* <Single content={product} direct={true} /> */}
				</div>
			</Row>
		</Layout>
	);
};

const renderImage = image => {
	return <Image srcSet={image.srcSet} />;
};

const ProductInfo = ({ format }) => (
	<div key={`format-${format.price}`} className="format mb-4">
		{format.attributes && <span>{format.attributes.nodes[0].value}</span>}
		<span className="price">{format.price ? format.price : `0 EUR`}</span>
		<CartButton
			productId={format.SKU ?? format.databaseId}
			text="Add to cart"
			disabled={true}
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
			description
			... on WpSimpleProduct {
				id
				name
				databaseId
				sku
				productInfo {
					fieldGroupName
					subtitle
					images {
						srcSet
					}
				}
				stockStatus
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
				stockStatus
				variations {
					nodes {
						name
						price
						slug
						type
						nodeType
						downloadable
						databaseId
						stockStatus
						sku
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
