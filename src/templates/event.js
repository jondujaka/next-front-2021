import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import Image from "../components/image";
import Carousel from "../components/carousel";
import SimpleContent from "../components/simpleContent";
import EventInfo from "../components/eventInfo";
import Style from "style-it";

const Events = ({ data: { event }, pageContext }) => {
	const { lang, settings, eventsList } = pageContext;
	const content = event.content;
	const info = event.eventInfo;

	const isSk = lang !== `en`;

	let translationSlug;
	if (event.translations.length) {
		translationSlug = event.translations[0].uri;
	}

	return (
		<Layout
			style={{
				color: settings.textColor,
				textColor: settings.textColor,
				backgroundColor: settings.backgroundColor
			}}
			isSk={isSk}
			translationSlug={translationSlug}
			editionHeader={settings.menu}
			skMenu={settings.skMenu}
			year={2021}
			pageName={isSk ? `Program` : `Programme`}
		>
			<Row>
				<div className="col-12 text-center mt-45 mb-6">
					<h1>{event.title}</h1>
				</div>

				<div className="col-12 make-first col-lg-6 sticky-carousel mb-6">
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

				<div className="col-12 col-lg-6 mb-6">
					{event.eventInfo.dates && event.eventInfo.dates.length && (
						<EventInfo event={event} showDetails />
					)}
					{content.content ? (
						content.content.map(section => (
							<SimpleContent
								section={section}
								key={section.fieldGroupName}
							/>
						))
					) : (
						<h4>Description coming soon...</h4>
					)}
				</div>
			</Row>
		</Layout>
	);
};

export default Events;

export const eventQuery = graphql`
	query eventById(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$id: String!
	) {
		# selecting the current post by id
		event: wpEvent(id: { eq: $id }) {
			id
			title
			language {
				slug
			}
			translations {
				slug
				uri
			}
			content: artistEventContent {
				images {
					srcSet
				}
				content {
					... on WpEvent_Artisteventcontent_Content_Media {
						fieldGroupName
						imageOrVideo
						video
						image {
							srcSet
						}
					}
					... on WpEvent_Artisteventcontent_Content_Text {
						fieldGroupName
						text
					}
				}
			}
			eventInfo {
				capacity
				format {
					slug
					name
				}
				fieldGroupName
				price
				venue {
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
					starttime
					endtime
					date
				}
			}
		}
	}
`;
