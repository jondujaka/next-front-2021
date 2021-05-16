import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import Masonry from "react-masonry-css";
import ProjectBlock from "../components/projectBlock";

const Projects = ({ data, pageContext }) => {
	const projects = data.projects.edges;
	return (
		<Layout>
			<Row classes="mt-6">
				<div className="col-12">
					<h2>Projects</h2>
				</div>
				<Masonry
					breakpointCols={2}
					className="my-masonry-grid"
					columnClassName="my-masonry-grid_column"
				>
					{projects.map(projectItem => (
						<ProjectBlock
							key={`projects-${projectItem.node.id}`}
							item={projectItem.node}
						/>
					))}
				</Masonry>
			</Row>
		</Layout>
	);
};

export default Projects;

export const eventQuery = graphql`
	query allProject {
		projects: allWpProject(sort: { order: DESC, fields: date }) {
			edges {
				node {
					date(formatString: "MMM Do YYYY")
					id
					slug
					uri
					title
					projectDescription {
						shortDescription
					}
				}
			}
		}
	}
`;
