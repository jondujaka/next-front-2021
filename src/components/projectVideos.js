import React, { useState } from "react";
import Separator from "./separator";
import Row from "./row";
import ReactPlayer from "react-player";

const ProjectVideos = ({ videos }) => {
	const [showMore, setShowMore] = useState(videos.videos.length <= 6);

	const handleClick = e => {
		e.preventDefault();
		setShowMore(true);
	};
	return (
		<>
			<Separator />
			<Row>
				<div className="col col-12 mt-5 mb-6">
					<h1>{videos.title}</h1>
				</div>
				{videos.videos.map((video, i) => {
					if (!showMore && i > 5) {
						return null;
					}
					return (
						<div key={video.videoUrl} className="project-videos col col-12 col-md-6 col-lg-4 my-4">
							<h4>{video.videoTitle}</h4>
							<ReactPlayer
								className="inline-player"
								url={video.videoUrl}
								width="100%"
								playing={true}
								controls={true}
								light={true}
							/>
						</div>
					);
				})}
				{!showMore && (
					<div className="col col-12 text-center mt-5">
						<a
							className="big-button"
							href="#"
							onClick={handleClick}
						>
							See more
						</a>
					</div>
				)}
			</Row>
		</>
	);
};

export default ProjectVideos;
