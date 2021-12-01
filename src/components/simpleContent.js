import React from "react";
import Image from "../components/image";
import Paragraph from "../components/paragraph";
import Carousel from "../components/carousel";
import ReactPlayer from "react-player/youtube";

const SimpleContent = ({ section }) => {
	if (section.fieldGroupName.endsWith(`Text`)) {
		return <Paragraph classes="mb-4" content={section.text} />;
	}
	if (section.fieldGroupName.endsWith(`Media`)) {
		return (
			<div className="single-media-wrapper my-5">
				<RenderMedia section={section} />
			</div>
		);
	}
};

const RenderMedia = ({ section }) => {
	if (section.imageOrVideo === `video`) {
		return (
			<ReactPlayer
				className="inline-player"
				url={section.video}
				width="100%"
				playing={false}
				controls={true}
			/>
		);
	} else if (section.image) {
		return (
			<Image
				srcSet={section.image.srcSet}
				caption={section.image.caption}
			/>
		);
	}

	return ``;
};

export default SimpleContent;
