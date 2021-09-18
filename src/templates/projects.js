import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import ProjectsGrid from "../components/blockGrids/projectsGrid";

const Projects = ({ data, pageContext }) => {
	const projects = data.projects.edges;
	const { latestEdition } = pageContext;

	const langSlug = pageContext.lang === `en` ? `sk/` : ``;
	const isSk = pageContext.lang !== `en`;
	const translationSlug = `/${langSlug}projects`;

	return (
		<Layout isSk={isSk} translationSlug={translationSlug} style={latestEdition}>
			<Row classes="mt-6">
				<div className="col col-12 mt-5 mb-6">
					<h2 className="festival-page-title">{data.page.title}</h2>
				</div>
				<ProjectsGrid items={projects} />
			</Row>
		</Layout>
	);
};

export default Projects;

export const projectsQuery = graphql`
	query allProject(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$id: String,
		$lang: String!
	) {
		projects: allWpProject(
			sort: { order: DESC, fields: date }
			filter: { language: { slug: { eq: $lang } } }
		) {
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
					language {
						slug
					}
				}
			}
		}
		page: wpPage(
			id: { eq: $id}
		) {
			id
			title
		}
	}
`;
