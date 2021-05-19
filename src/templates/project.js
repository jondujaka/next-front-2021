import React from "react";
import { graphql, Link } from "gatsby";
import LangSwitcher from "../components/LangSwitcher";
import Layout from "../components/layout";
import Row from "../components/row";
import Single from "./single";
import ProjectsGrid from "../components/blockGrids/projectsGrid";

const Project = ({ data: { project }, pageContext }) => {
	console.log(pageContext);

	let related = pageContext.related.map(project => {
		let newObj = { node: {...project.project}};
		return newObj;
		
	});

	console.log(related);
	return (
		<Layout>
			<Single content={project} />
			<Row>
				<div className="col col-12"><h2>More projects</h2></div>
				<ProjectsGrid items={related} />
			</Row>
		</Layout>
	);
};

export default Project;

export const ProjectData = graphql`
	query projectById(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$id: String!
	) {
		# selecting the current post by id
		project: wpProject(id: { eq: $id }) {
			id
			title
			singlePostContent {
				content {
					... on WpProject_Singlepostcontent_Content_MediaText {
						direction
						fieldGroupName
						paragraph {
							paragraphContent
							fieldGroupName
							big
						}
						media {
							image {
								caption
								srcSet
							}
							imageOrVideo
							video
						}
					}
					... on WpProject_Singlepostcontent_Content_Images {
						fieldGroupName
						images {
							caption
							srcSet
						}
						imageOrVideo
						video
					}
					... on WpProject_Singlepostcontent_Content_Text {
						fieldGroupName
						paragraph {
							paragraphContent
							fieldGroupName
							big
						}
					}
				}
			}
		}
	}
`;
