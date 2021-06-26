import React from "react";
import { graphql, Link } from "gatsby";
import LangSwitcher from "../components/LangSwitcher";
import Layout from "../components/layout";
import gql from "graphql-tag";
import Row from "../components/row";
import Image from "../components/image";
import Carousel from "../components/carousel";
import SimpleContent from "../components/simpleContent";
import EventInfo from "../components/eventInfo";

const Artist = ({ data: { artist }, pageContext, preview }) => {
	const { lang, settings, eventsList, menu } = pageContext;
	const year = pageContext.year || 2021;

	const content = artist.artistEventContent;

	// let langTo = artist.language.slug == `sk` ? `/sk` : ``;
	// const { content } = artist.singlePostContent;

	// let colorStyle;
	// if (settings) {
	// 	colorStyle = {
	// 		color: settings.textColor,
	// 		backgroundColor: settings.backgroundColor
	// 	};
	// }

	return (
		<Layout
			style={{
				color: settings.textColor,
				backgroundColor: settings.backgroundColor
			}}
			year={year}
		>
			{!content.content ? (
				<h1>No content yet</h1>
			) : (
				<Row>
					<div className="col-12 text-center">
						<h1>{artist.title}</h1>
					</div>
					<div className="col-12 d-none d-lg-block col-lg-5 col-xl-6 about-nav">
						{content.images && (
							<>
								{content.images.length > 1 ? (
									<Carousel
										items={content.images}
										style={{ color: settings.textColor }}
									/>
								) : (
									<Image srcSet={content.images[0].srcSet} />
								)}
							</>
						)}
					</div>
					<div className="col-12 col-lg-7 col-xl-6">
						{eventsList.map((event, i) => (
							<EventInfo event={event} key={`even	t-${i}`} />
						))}
						{content.content.map(section => (
							<SimpleContent
								section={section}
								key={section.fieldGroupName}
							/>
						))}
						{content.content.map(section => (
							<SimpleContent
								section={section}
								key={section.fieldGroupName}
							/>
						))}
					</div>
				</Row>
			)}
		</Layout>
	);
};

export const artistQuery = graphql`
	query artistById(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$id: String!
	) {
		# selecting the current post by id
		artist: wpArtist(id: { eq: $id }) {
			id
			title
			language {
				slug
			}
			translations {
				slug
				uri
			}
			artistEventContent {
				images {
					srcSet
				}
				content {
					... on WpArtist_Artisteventcontent_Content_Media {
						fieldGroupName
						imageOrVideo
						video
						image {
							srcSet
						}
					}
					... on WpArtist_Artisteventcontent_Content_Text {
						fieldGroupName
						text
					}
				}
			}
		}
	}
`;

const PREVIEW_QUERY = gql`
	query getPreview($id: Int!) {
		wpArtist(id: { eq: $id }) {
			title
		}
	}
`;

export default Artist;
