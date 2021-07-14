import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import Image from "../components/image";
import Carousel from "../components/carousel";
import SimpleContent from "../components/simpleContent";
import EventInfo from "../components/eventInfo";

const Events = ({ data: { event }, pageContext }) => {
	const { lang, settings, eventsList } = pageContext;
	const content = event.artistEventContent;
	const info = event.eventInfo;
	return (
		<Layout
			style={{
				color: settings.textColor,
				backgroundColor: settings.backgroundColor
			}}
			editionHeader={settings.menu}
			year={2021}
		>
			<Row>
				<div className="col-12 text-center my-3">
					<h1>{event.title}</h1>
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
					<EventInfo event={event} showDetails />
					{content.content &&
						content.content.map(section => (
							<SimpleContent
								section={section}
								key={section.fieldGroupName}
							/>
						))}
					{content.content &&
						content.content.map(section => (
							<SimpleContent
								section={section}
								key={section.fieldGroupName}
							/>
						))}
					{info.artists &&
						info.artists.map(artist => (
							<ArtistBlock artist={artist} key={artist.id} />
						))}
				</div>
			</Row>
		</Layout>
	);
};

export default Events;

const ArtistBlock = ({ artist }) => {
	return (
		<Link to={artist.uri} className="col-8 mt-7 d-block">
			<h3 className="big">{artist.title}</h3>
			<Image srcSet={artist.featuredImage.node.srcSet} />
		</Link>
	);
};

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
			artistEventContent {
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
