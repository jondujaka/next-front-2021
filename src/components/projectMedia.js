import React from "react";
import ProjectImages from "./projectImages";
import ProjectVideos from "./projectVideos";

const ProjectMedia = ({ media }) => {
	const images = media.images;
	const videos = media.videos;

	return (
		<>
			{videos.videos?.length && <ProjectVideos videos={videos} />}
			{images.imageGroups?.length && <ProjectImages images={images} />}
		</>
	);
};

export default ProjectMedia;
