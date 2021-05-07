import React from "react";
import { Link } from "gatsby";

const NewsBlock = ({ item }) => {

	const image = item.featuredImage.node.mediaDetails.sizes.find(size => size.name === `big-thumbnail`);
	return (
		<Link
			to={item.uri}
			className="news-item py-5 px-2 col col-12 col-md-6"
		>
			<div className="row">
				<div className="news-image col col-xl-6 col-12">
					{image && <img className="img-fluid" src={image.sourceUrl} />}
				</div>
				<div className="news-info col col-xl-6 col-12">
					<h3 className="mt-5 mt-lg-0">{item.date}</h3>
					<h3 className="news-title">{item.title}</h3>
				</div>
			</div>
		</Link>
	);
};

export default NewsBlock;
