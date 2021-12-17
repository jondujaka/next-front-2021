import React from "react";
import { Link } from "gatsby";
import { fromPromise } from "apollo-link";

const Product = ({item}) => {
	const content = item.node;
	const image = content.featuredImage?.node?.srcSet || ``;

	const formats =content.productInfo.variations ? content.productInfo.variations.nodes.map(variation => ({
		slug: variation.format
	})) : content.snipcategories && content.snipcategories.nodes.map(category => ({
		slug: category.slug,
		name: category.name
	}));

	return (
		<Link
			className="product-item p-4 col-6 col-lg-4 mb-3 mb-lg-5"
			to={content.uri}
		>
			{/* <div className="row p-1 p-md-3 ">
				
			</div> */}

			<div className="product-info col col-12 text-center">
					<h3 className="product-title">{content.title || content.name}</h3>
					{content.productInfo?.subtitle && (
						<h3 className="product-title">
							{content.productInfo.subtitle}
						</h3>
					)}
				</div>
				<div className="product-image col col-12">
					{image && <img srcSet={image} />}
					{formats && formats.length ? <div className="product-formats">
						{formats.map(format => <span key={format.slug}>{format.slug}</span>)}
					</div> : ``}
				</div>
		</Link>
	);
};

export default Product;
