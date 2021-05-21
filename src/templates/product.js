import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import Carousel from "../components/carousel";
import CartButton from "../components/cartButton";
import Single from "./single.js";

const Product = ({ data, pageContext }) => {
	const product = data.product;
	const carouselItems = product.productInfo.images;

	const addToCart = (price) => {
		console.log(`Add to cart ${price}`);
	}
	
	return (
		<Layout>
			<Row classes="mt-6">
				<div className="col col-12 col-lg-6 product-carousel">
					{carouselItems.length && <Carousel items={carouselItems} />}
				</div>
				<div className="col col-12 col-lg-6">
					<h2>{product.name}</h2>
					<h3 className="product-subtitle">{product.productInfo.subtitle}</h3>
					<div className="formats">
						{product.variations.nodes.map(format => {
							console.log(format);
							return (
								<div key={`format-${format.price}`} className="format mb-4">
									{format.price && <span>{format.price}</span>}
									<span>
										{format.attributes.nodes[0].value}
									</span>
									<CartButton productId={format.databaseId} callBack={() => addToCart(format.price)} classes="ml-4" text="Add to cart" />
								</div>
							);
						})}
					</div>
					<Single content={product} direct={true}/>
				</div>

			</Row>
		</Layout>
	);
};

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
			... on WpVariableProduct {
				id
				name
				databaseId
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
			singlePostContent {
				content {
					... on WpProduct_Singlepostcontent_Content_MediaText {
						direction
						fieldGroupName
						paragraph {
							paragraphContent
							fieldGroupName
							big
						}
						media {
							image {
								caption
								srcSet
							}
							imageOrVideo
							video
						}
					}
					... on WpProduct_Singlepostcontent_Content_Images {
						fieldGroupName
						images {
							caption
							srcSet
						}
						imageOrVideo
						video
					}
					... on WpProduct_Singlepostcontent_Content_Text {
						fieldGroupName
						paragraph {
							paragraphContent
							fieldGroupName
							big
						}
					}
				}
			}
			... on WpVariableProduct {
				id
				name
				productInfo {
					fieldGroupName
					subtitle
					images {
						srcSet
					}
				}
			}
		}
	}
`;
