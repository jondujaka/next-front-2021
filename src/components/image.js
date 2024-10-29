import React from "react";

const ImageEl = ({ srcSet, caption, fixedRatio }) => {
	if (!srcSet) return null;

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
