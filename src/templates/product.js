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
						{` > ${product.title}`}
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
						{product.productInfo.variations &&
							product.productInfo.variations.map(format => {
								return <ProductInfo product={product} format={format} />;
							})
						}
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

const ProductInfo = ({product, format }) => (
	<div key={`format-${format.price}`} className="format mb-4">
		<span>{format.format}</span>
		<span className="price">{format.price ? format.price : `0 EUR`}</span>
		<CartButton
			format={format}
			product={product}
			text="Add to cart"
			disabled={true}
		/>
	</div>
);

export default Product;

export const productQuery = graphql`
	query productById(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$id: Int!
	) {
		# selecting the current post by id
		product: wpSnipproduct(databaseId: { eq: $id }) {
			databaseId
			title
			slug
			uri

			featuredImage {
				node {
					srcSet
					sourceUrl
				}
			}

			productInfo {
				description
				subtitle
				variations {
					price
					format
					downloadLink {
						sourceUrl
					}
				}
				images {
					srcSet
				}
			}
			snipcategories {
				nodes {
					slug
				}
			}
		}
	}
`;
