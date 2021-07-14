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

const Workshop = ({ data: { workshop }, pageContext, preview }) => {
	const { lang, year, settings, eventsList, menu } = pageContext;

	const content = workshop.artistEventContent;

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
			editionHeader={settings.menu}
			year={year}
		>
			{!content.content ? (
				<h1>No content yet</h1>
			) : (
				<Row>
					<div className="col-12 text-center">
						<h1>{workshop.title}</h1>
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
						<EventInfo event={workshop} showDetails />	
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

export const workshopQuery = graphql`
	query workshopById(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$id: String!
	) {
		# selecting the current post by id
		workshop: wpWorkshop(id: { eq: $id }) {
			id
			title
			artistEventContent {
				images {
					srcSet
				}
				content {
					... on WpWorkshop_Artisteventcontent_Content_Media {
						fieldGroupName
						imageOrVideo
						video
						image {
							srcSet
						}
					}
					... on WpWorkshop_Artisteventcontent_Content_Text {
						fieldGroupName
						text
					}
				}
			}
			
			eventInfo {
				capacity
				artists {
					... on WpArtist {
						id
						uri
						title
						featuredImage {
							node {
								srcSet
							}
						}
					}
				}
				format
				fieldGroupName
				price
				venues {
					... on WpVenue {
						id
						venueInfo {
							color
							mapsLink
						}
						title
					}
				}
				dates {
					startTime
					endTime
					date
				}
			}
		}
	}
`;


export default Workshop;
