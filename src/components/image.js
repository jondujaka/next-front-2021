import LazyLoadImage from "react-lazy-load-image-component";
import React from "react";

const ImageEl = ({ srcSet, caption }) => {

	if(!srcSet) return null;

	return (
			<figure>
				<img srcSet={srcSet} />
				{caption ? (
					<figcaption dangerouslySetInnerHTML={{ __html: caption }} />
				) : (
					``
				)}
			</figure>
	);
};

export default ImageEl;
