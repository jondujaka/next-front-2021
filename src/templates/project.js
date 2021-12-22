import React, { useState } from "react";
import { graphql, Link } from "gatsby";
import LangSwitcher from "../components/LangSwitcher";
import Layout from "../components/layout";
import Row from "../components/row";
import Separator from "../components/separator";
import Single from "./single";
import ProjectsGrid from "../components/blockGrids/projectsGrid";
import ProjectMedia from "../components/projectMedia";
import NewsBlock from "../components/newsBlock";

const Project = ({ data: { project, news }, pageContext }) => {
	let related = pageContext.related
		? pageContext.related.map(project => {
				let newObj = { node: { ...project.project } };
				return newObj;
		  })
		: [];

	const isSk = project.language.slug === `sk`;
	const translationSlug = project.translations[0].uri;
	const { latestEdition } = pageContext;

	const allNews = news.edges;

	const [showAllRelatedNews, setShowAllRelatedNews] = useState(
		allNews.length <= 4
	);
	const handleClick = e => {
		e.preventDefault();
		setShowAllRelatedNews(!showAllRelatedNews);
	};

	return (
		<Layout
			isSk={isSk}
			translationSlug={translationSlug}
			style={latestEdition}
		>
			<Row>
				<div className="col col-12 mt-5 mb-6">
					<h2 className="festival-page-title">
						<Link
							className="inherit"
							to={`${isSk ? `/sk` : ``}/projects`}
						>
							{isSk ? `Projekty` : `Projects`}
						</Link>
						{` > ${project.title}`}
					</h2>
				</div>
			</Row>
			<Single content={project} />

			{allNews.length ? (
				<>
					<Separator />
					<Row>
						<div className="col col-12 mt-5 mb-6">
							<h1>{isSk ? `Related news` : `Related news`}</h1>
						</div>
						{allNews.map((newsItem, i) => {
							if (showAllRelatedNews) {
								return (
									<NewsBlock
										key={`news-${newsItem.node.id}`}
										item={newsItem.node}
									/>
								);
							} else {
								if (i < 4) {
									return (
										<NewsBlock
											key={`news-${newsItem.node.id}`}
											item={newsItem.node}
										/>
									);
								}
							}
						})}

						<div className="col col-12 text-center mt-5">
							<a
								className="big-button"
								href="#"
								onClick={handleClick}
							>
								{showAllRelatedNews ? `See less` : `See more`}
							</a>
						</div>
					</Row>
				</>
			) : (
				``
			)}

			{project.projectDescription.media && (
				<ProjectMedia media={project.projectDescription.media} />
			)}

			{related.length ? (
				<>
					<Separator />
					<Row>
						<div className="col col-12 mt-5 mb-6">
							<h1>{isSk ? `Viac` : `More projects`}</h1>
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
		$newsTag: [String]
		$lang: String
	) {
		news: allWpNewsArticle(
			sort: { order: DESC, fields: date }
			filter: {
				tags: {
					nodes: {
						elemMatch: {
							slug: { in: $newsTag }
							language: { slug: { eq: $lang } }
						}
					}
				}
			}
		) {
			edges {
				node {
					date(formatString: "MMM Do YYYY")
					id
					slug
					uri
					title
					language {
						slug
					}
					featuredImage {
						node {
							srcSet
						}
					}
				}
			}
		}
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
			projectDescription {
				media {
					videos {
						title
						videos {
							videoUrl
							videoTitle
						}
					}
					images {
						title
						imageGroups {
							groupTitle
							images {
								srcSet
								sourceUrl
								caption
							}
						}
					}
				}
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
