import React from "react";
import { Link } from "gatsby";

const NewsBlock = ({ item }) => {
	const image = item.featuredImage?.node?.srcSet;
	return (
		<Link to={item.uri} className="news-item col col-lg-6 col-12">
			<div className="news-image">
				{image && <div className="square image-wrapper"><img className="img-fluid" srcSet={image} /></div>}
			</div>
			<div className="news-info">
				<h3 className="news-title">{item.title}</h3>
			</div>
		</Link>
	);
};

export default NewsBlock;
