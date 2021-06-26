import React from "react";
import { Link } from "gatsby";

const ArtistBlock = ({ item, style }) => {
	if (!item) {
		return ``;
	}
	if (item.node) {
		item = item.node;
	}
	let image = item.featuredImage?.node.mediaDetails.sizes.find(
		size => size.name === `big-thumbnail`
	);

	if (!image) {
		image = item.featuredImage?.node.mediaDetails.sizes.find(
			size => size.name === `thumbnail`
		);
	}
	if (!item.uri) {
		return ``;
	}
	return (
		<Link className="artist-item py-5 px-2 col-6 col-xl-4" to={item.uri}>
			<div className="row">
				<div className="artist-info col col-12 text-center">
					<h3 className="artist-title">{item.title}</h3>
				</div>
				<div className="artist-image col col-12">
					{image && (
						<img className="img-fluid" srcSet={image.sourceUrl} />
					)}
				</div>
			</div>
		</Link>
	);
};

export default ArtistBlock;
