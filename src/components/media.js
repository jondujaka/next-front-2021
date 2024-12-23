import React from "react";
import Image from "./image";

const getColNr = length => (length === 1 ? 8 : 12 / length);
const Media = ({ content, classes }) => {
	if (content.images) {
		return content.images.map((image, i) => (
			<SingleMedia
				key={`media-${content.fieldGroupName}-${i}`}
				classes={`col-12 mb-5 col-lg-${getColNr(
					content.images.length
				)}`}
				item={image}
			/>
		));
	} else {
		return <SingleMedia classes={classes} item={content.image} />;
	}
};

const SingleMedia = ({ item, classes }) => {
	if (!item || !item.srcSet) {
		return "";
	}
	return (
		<div className={`col ${classes ? classes : ``}`}>
			<Image srcSet={item.srcSet} caption={item.caption} />
		</div>
	);
};

export default Media;
