import React from "react";
import { graphql, Link } from "gatsby";
import withPreview from "../components/withPreview";
import LangSwitcher from "../components/LangSwitcher";
import Layout from "../components/layout";
import gql from "graphql-tag";
import Row from "../components/row";
import Image from "../components/image";
import Carousel from "../components/carousel";
import SimpleContent from "../components/simpleContent";
import EventInfo from "../components/eventInfo";
import { node } from "prop-types";
import { parse } from "query-string";

const Artist = ({ data: { artist, events }, pageContext }) => {
	const { lang, year, settings, menu } = pageContext;

	const content = artist.artistEventContent;
	const isSk = lang && lang !== `en`;

	const eventsList = events.edges.filter(event => {
		return (
			event.node.eventInfo.artists &&
			event.node.eventInfo.artists.some(
				eventArtist => artist.translations.length && eventArtist.id === artist.translations[0].id
			)
		);
	});
	
	const parsedEvents = eventsList.map(ev => {
		if(isSk) {
			return {
				...ev.node,
				url: ev.node.translations.length ? `/${lang}/${year}/events/${ev.node.translations[0].slug}` : ev.node.uri
			}
		} else {
			return {
				...ev.node,
				url: ev.node.uri
			}
		}
	});
	

	let translationSlug;
	if(artist.translations.length){
		translationSlug = artist.translations[0].uri;
	}

	return (
		<Layout
			style={{
				color: settings.textColor,
				backgroundColor: settings.backgroundColor
			}}
			editionHeader={settings.menu}
			skMenu={settings.skMenu}
			isSk={isSk}
			translationSlug={translationSlug}
			year={year}
		>
			{!content ? (
				<h1>No content yet</h1>
			) : (
				<Row>
					<div className="col-12 text-center mt-4 mb-lg-6 mb-4">
						<h1>{artist.title}</h1>
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
						{parsedEvents.map((event, i) => (
							<EventInfo event={event} key={`event-${i}`} />
						))}
						
						{content.content ? content.content.map((section, i) => (
							<SimpleContent
								section={section}
								key={`${section.fieldGroupName}-${i}`}
							/>
						)) : <p>Description coming soon...</p>}
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
			databaseId
			language {
				slug
			}
			translations {
				id
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
		events: allWpEvent(filter: {language: { slug: { eq: "en" }}}) {
			edges {
				node {
					id
					translations {
						slug
					}
					eventInfo {
						artists {
							... on WpArtist {
								id
								slug
							}
						}
						venue {
							... on WpVenue {
								uri
								title
								slug
								venueInfo {
									mapsLink
								}
							}
						}
						dates {
							starttime
							endtime
							date
						}
					}
					slug
					uri
				}
			}
		}
	}
`;

export default Artist;
