import React from "react";
import Image from "../components/image";
import Paragraph from "../components/paragraph";
import Carousel from "../components/carousel";
import ReactPlayer from "react-player/youtube";

const SimpleContent = ({ section }) => {
	if (section.fieldGroupName.endsWith(`Text`)) {
		return <Paragraph content={section.text} />;
	}
	if (section.fieldGroupName.endsWith(`Media`)) {
		if (section.imageOrVideo === `video`) {
			return (
				<ReactPlayer
					className="inline-player mb-5"
					url={section.video}
					width="100%"
					playing={false}
				/>
			);
		} else {
			return (
				<Image
					srcSet={section.image.srcSet}
					caption={section.image.caption}
				/>
			);
		}
	}
};

export default SimpleContent;