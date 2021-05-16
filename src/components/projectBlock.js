import React from "react";
import { Link } from "gatsby";
import { LoremIpsum } from 'react-lorem-ipsum';

const ProjectBlock = ({ item }) => {

	return (
		<Link
			className="project-item py-5 px-2 mb-6"
			to={item.uri}
		>
			<div className="row">
				<div className="project-info col col-12">
					<h3 className="project-title">{item.title}</h3>
				</div>
				<div>
					<p>{item.projectDescription.shortDescription}</p>
				</div>
				
			</div>
		</Link>
	);
};

export default ProjectBlock;
