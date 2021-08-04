import React from "react";
import { Link } from "gatsby";

const NewsBlock = ({ item }) => {
	const image = item.featuredImage.node?.srcSet
	return (
		<Link to={item.uri} className="news-item col col-lg-6 col-12">
			<div className="news-image square">
				{image && <img className="img-fluid" srcSet={image} />}
			</div>
			<div className="news-info">
				<h3 className="mt-0 news-date">{item.date}</h3>
				<h3 className="news-title">{item.title}</h3>
			</div>
		</Link>
	);
};

export default NewsBlock;
