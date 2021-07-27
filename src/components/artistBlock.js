import React from "react";
import { Link } from "gatsby";
import Style from 'style-it';
import ImageEl from './image';

const ArtistBlock = ({ item, style, colors }) => {
	if (!item) {
		return ``;
	}
	console.log(item);
	if (item.node) {
		item = item.node;
	}
	let image = item.featuredImage?.node.mediaDetails?.sizes.find(
		size => size.name === `big-thumbnail`
	);

	if (!image) {
		image = item.featuredImage && item.featuredImage.node.srcSet
	}
	if (!item.uri) {
		return ``;
	}

	const styles = colors ? `
		.artist-item .row:hover {
			color: ${colors.backgroundColor};
			background: ${colors.textColor};
		}
	` : ``;
	return Style.it(styles,
		<Link className="artist-item px-2 px-md-4 col-6 col-lg-4 mb-5" to={item.uri}>
			<div className="row p-1 p-md-3 ">
				<div className="artist-info col col-12 text-center">
					<h3 className="artist-title">{item.title}</h3>
				</div>
				<div className="artist-image col col-12">
					{image && (
						<ImageEl srcSet={image} />
						
					)}
					
				</div>
			</div>
		</Link>
	);
};

export default ArtistBlock;
