import React, { useState } from "react";
import { graphql, Link, navigate } from "gatsby";
import Scrollspy from "react-scrollspy";
import Layout from "../components/layout";
import Dropdown from "react-dropdown";
import Row from "../components/row";
import Image from "../components/image";
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

	const { grants, menuLabels, media, menuImages } =
		project.projectDescription;

	const hasProjectMenu = menuLabels && Object.keys(menuLabels).length;

	const allNews = news.edges;

	const [showAllRelatedNews, setShowAllRelatedNews] = useState(
		allNews.length <= 4
	);
	const handleClick = e => {
		e.preventDefault();
		setShowAllRelatedNews(!showAllRelatedNews);
	};

	const sectionIds = [
		"project-about",
		"project-grants",
		"project-news",
		"project-videos",
		"project-pictures"
	];

	const menuItems = [
		{
			value: "#project-about",
			label: menuLabels.about
		},
		{
			value: "#project-grants",
			label: menuLabels.grant
		},
		{
			value: "#project-news",
			label: menuLabels.news
		},
		{
			value: "#project-videos",
			label: menuLabels.videos
		},
		{
			value: "#project-pictures",
			label: menuLabels.pictures
		}
	];

	const [currentItem, setCurrentItem] = useState(menuItems[0]);

	const internalHandleClick = item => {
		navigate(item.value);
	};

	const changeActiveItem = value => {
		if(!value?.id) {
			return;
		}
		const targetItem = menuItems.find(item => item.value === `#${value.id}`);

		console.log(targetItem)
		if(targetItem){
			setCurrentItem(targetItem);
		}
	}

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

			<Row>
				<div className="col-12">
					{project.title && (
						<h1 className="single-title">{project.title}</h1>
					)}
				</div>
			</Row>
			{hasProjectMenu && (
				<div className="project-menu edition-menu-wrapper  position-sticky">
					<nav className="project-nav project-desktop-nav">
						<Scrollspy
							items={sectionIds}
							currentClassName="active"
							offset={-100}
							onUpdate={changeActiveItem}
						>
							{menuItems.map(item => (
								<li>
									<a href={item.value}>{item.label}</a>
								</li>
							))}
						</Scrollspy>
					</nav>
					<div className="project-mobile-nav">
						<Dropdown
							options={menuItems}
							onChange={internalHandleClick}
							placeholder={currentItem.label}
							value={currentItem.value}
						/>
					</div>

					<div className="menu-images">
						{menuImages &&
							menuImages.map(image => (
								<div className="single-menu-image">
									<Image srcSet={image.srcSet || ""} />
								</div>
							))}
					</div>
				</div>
			)}

			<Single noTitle content={project} id="project-about" />

			{grants && (
				<>
					<Separator />
					<Row id="project-grants">
						<div className="col col-12 mt-5 mb-6">
							<h1>{grants.title}</h1>
						</div>
						<div className="col-lg-6 col-12 mx-auto">
							<div
								dangerouslySetInnerHTML={{
									__html: grants.text
								}}
							/>
						</div>
					</Row>
				</>
			)}

			{allNews.length ? (
				<>
					<Row id="project-news">
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

			{media && <ProjectMedia media={media} />}

			{related.length ? (
				<>
					<Separator />
					<Row id="project-related">
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
				grants {
					text
					title
				}
				menuLabels {
					videos
					pictures
					news
					grant
					about
				}
				menuImages {
					srcSet
				}
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
