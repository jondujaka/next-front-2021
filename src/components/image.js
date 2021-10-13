import LazyLoadImage from "react-lazy-load-image-component";
import React from "react";

const ImageEl = ({ srcSet, caption, fixedRatio }) => {

	if (!srcSet) return null;

	console.log('image')

	return (
		<figure className={caption ? `` : `fixed-ratio`}>
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
