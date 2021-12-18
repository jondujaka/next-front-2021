import React from "react";
import { Link } from "gatsby";
import { fromPromise } from "apollo-link";

const Product = ({item}) => {
	const content = item.node;
	const image = content.featuredImage?.node?.srcSet || ``;

	const formats = content.productInfo.variations;

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
						{formats.map(format => format.format !== 'default' && <span className="product-format" key={format.format}>{format.format}</span>)}
					</div> : ``}
				</div>
		</Link>
	);
};

export default Product;
