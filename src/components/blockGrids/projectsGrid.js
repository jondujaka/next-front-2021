import React from "react";
import Masonry from "react-masonry-css";
import ProjectBlock from "../projectBlock";

const projectsGrid = ({ items }) => {
	const breakpointColumnsObj = {
		default: 2,
		1140: 1
	};

	return (
		<Masonry
			breakpointCols={breakpointColumnsObj}
			className="my-masonry-grid"
			columnClassName="my-masonry-grid_column"
		>
			{items.map(projectItem => (
				<ProjectBlock
					key={`projects-${projectItem.node.id}`}
					item={projectItem.node}
				/>
			))}
		</Masonry>
	);
};

export default projectsGrid;
