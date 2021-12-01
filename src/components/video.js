import React from "react";
import ReactPlayer from "react-player";
const Video = ({ url }) => {
	if (!url) {
		return;
	}
	return (
		<ReactPlayer
			className="inline-player"
			url={url}
			width="100%"
			playing={false}
			controls={true}
		/>
	);
};

export default Video;
