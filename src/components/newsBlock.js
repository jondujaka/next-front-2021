import React from "react";
import { Link } from "gatsby";

const NewsBlock = ({ item }) => {
	console.log(item);

	const image = item.featuredImage.node.mediaDetails.sizes.find(size => size.name === `big-thumbnail`);
	return (
		<Link
			to={item.uri}
			className="news-item"
		>
			<div className="news-image">
				{image && <img src={image.sourceUrl} />}
			</div>
			<div className="news-info">
				<h3>{item.date}</h3>
				<h3 className="news-title">{item.title}</h3>
			</div>
		</Link>
	);
};

export default NewsBlock;
