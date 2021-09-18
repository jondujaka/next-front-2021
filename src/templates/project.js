import React from "react";
import { graphql, Link } from "gatsby";
import LangSwitcher from "../components/LangSwitcher";
import Layout from "../components/layout";
import Row from "../components/row";
import Separator from "../components/separator";
import Single from "./single";
import ProjectsGrid from "../components/blockGrids/projectsGrid";

const Project = ({ data: { project }, pageContext }) => {
	let related = pageContext.related
		? pageContext.related.map(project => {
				let newObj = { node: { ...project.project } };
				return newObj;
		  })
		: [];

	const isSk = project.language.slug === `sk`;
	const translationSlug = project.translations[0].uri;
	const { latestEdition } = pageContext;

	return (
		<Layout isSk={isSk} translationSlug={translationSlug} style={latestEdition}>
			<Row>
				<div className="col col-12 mt-5 mb-6">
					<h2 className="festival-page-title">
						<Link
							className="inherit"
							to={`${isSk ? `/sk` : ``}/projects`}
						>
							{isSk ? `Projoekty` : `Projects`}
						</Link>
						{` > ${project.title}`}
					</h2>
				</div>
			</Row>
			<Single content={project} />

			{related.length ? (
				<>
					<Separator />
					<Row>
						<div className="col col-12 mt-5 mb-6">
							<h1>More projects</h1>
						</div>
						<ProjectsGrid items={related} />
					</Row>
				</>
			) : (
				``
			)}
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
			language {
				slug
			}
			translations {
				uri
			}
			singleContent {
				content {
					... on WpProject_Singlecontent_Content_MediaText {
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
					... on WpProject_Singlecontent_Content_Media {
						fieldGroupName
						images {
							caption
							srcSet
						}
						imageOrVideo
						video
					}
					... on WpProject_Singlecontent_Content_Text {
						fieldGroupName
						paragraphContent
						big
					}
				}
			}
		}
	}
`;
