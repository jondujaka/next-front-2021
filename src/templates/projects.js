import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import ProjectsGrid from "../components/blockGrids/projectsGrid"

const Projects = ({ data, pageContext }) => {
	const projects = data.projects.edges;

	return (
		<Layout>
			<Row classes="mt-6">
				<div className="col-12">
					<h2>Projects</h2>
				</div>
				<ProjectsGrid items={projects} />
			</Row>
		</Layout>
	);
};

export default Projects;

export const projectsQuery = graphql`
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
