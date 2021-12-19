import React from "react";
import ProjectImages from "./projectImages";
import ProjectVideos from "./projectVideos";

const ProjectMedia = ({ media }) => {
	const images = media.images;
	const videos = media.videos;

	console.log(videos);

	return (
		<>
			{images.imageGroups?.length && <ProjectImages images={images} />}
			{videos.videos?.length && <ProjectVideos videos={videos} />}
		</>
	);
};

export default ProjectMedia;
