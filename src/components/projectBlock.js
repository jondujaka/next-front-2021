import React from "react";
import { Link } from "gatsby";
import { LoremIpsum } from 'react-lorem-ipsum';

const ProjectBlock = ({ item }) => {

	if(!item){
		return null;
	}

	return (
		<Link
			className="project-item py-5 px-2 mb-6"
			to={item.uri}
		>
			<div className="row">
				<div className="project-info mb-4 col col-12">
					<h1>{item.title}</h1>
				</div>
				<div>
					<p>{item.projectDescription ? item.projectDescription.shortDescription : `Placeholder paragraph`}</p>
				</div>
				
			</div>
		</Link>
	);
};

export default ProjectBlock;
