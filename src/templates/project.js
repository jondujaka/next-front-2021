import React from "react";
import { graphql, Link } from "gatsby";
import LangSwitcher from "../components/LangSwitcher";
import Layout from "../components/layout";
import Single from "./single";

const Project = ({ data: { project }, pageContext }) => {
	console.log(project);
	return (
		<Layout>
			<Single content={project} />
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
