import React from "react";
import { Link } from "gatsby";

const CommissionBlock = ({ item }) => {
	const image = item.featuredImage.node.mediaDetails.sizes.find(size => size.name === `big-thumbnail`);
	return (
		<Link
			className="commission-item py-5 px-2 col-md-6 col-12 mb-6 col-xl-4"
			to={item.uri}
		>
			<div className="row">
				<div className="commission-info col col-12 text-center">
					<h3 className="commission-title">{item.title}</h3>
				</div>
				<div className="commission-image col col-12">
					{image && <img className="img-fluid" src={image.sourceUrl} />}
				</div>
				
			</div>
		</Link>
	);
};

export default CommissionBlock;
