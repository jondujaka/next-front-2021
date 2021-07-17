import React, { useState, useEffect } from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import MapPin from "../components/mapPin";
import { format, localeFormat } from "light-date";

const ProgrammeTemplate = ({ data, pageContext }) => {
	// const artistsList = data.artists.edges;
	const { settings, edition, menu } = pageContext;
	console.log(data);

	const allEvents = data.events.edges;
	const allDays = {};

	allEvents.forEach(event => {
		const { eventInfo } = event.node;
		if (!eventInfo.dates) {
			return;
		}
		eventInfo.dates.forEach(date => {
			let dateSlug = date.date;

			if (!allDays.hasOwnProperty(dateSlug)) {
				const dateobj = new Date(date.date);
				const dayName = localeFormat(dateobj, "{EEE}");
				const monthName = localeFormat(dateobj, "{MMM}");
				const dayNr = format(dateobj, `{dd}`);
				allDays[dateSlug] = {
					name: `${dayName} ${dayNr} ${monthName}`,
					slug: dateSlug,
					items: []
				};
			}
			let simplifiedEvent = {
				...event.node,
				date: eventInfo.dates.find(date => date.date === dateSlug)
			};
			allDays[dateSlug].items.push(simplifiedEvent);
		});
	});

	return (
		<Layout
			style={{
				color: settings.textColor,
				backgroundColor: settings.backgroundColor
			}}
			editionHeader={menu}
			year={edition}
		>
			<Row>
				<div className="col col-12 px-0">
					<h1 className="normal-line-height fw-title border-bottom-thick">Programme</h1>
				</div>
				{allDays &&
					Object.keys(allDays).map(key => (
						<Day
							day={allDays[key]}
							key={key}
							bgColor={settings.backgroundColor}
						/>
					))}
			</Row>
		</Layout>
	);
};

const Day = ({ day, bgColor }) => {
	return (
		<div id={day.slug} className="col col-12 day-wrapper px-0">
			<h5 className="day-title fw-title" style={{ background: bgColor }}>
				{day.name}
			</h5>
			<div className="schedule-items-wrapper">
				{day.items.map(item => (
					<ScheduleItem key={item.slug} item={item} />
				))}
			</div>
		</div>
	);
};

const ScheduleItem = ({ item }) => {
	let time = `${item.date.startTime} - ${item.date.endTime}`;
	const venue = item.eventInfo.venues ? item.eventInfo.venues[0] : null;
	const online = true;
	return (
		<Link to={item.uri} className="schedule-item">
			<span className="item-time">{time}</span>
			<span className="item-info">
				{item.title}
			</span>
			<div className="item-location">
				{venue && (
					<a
						className="venue-info"
						href={venue.venueInfo.mapsLink}
						target="_blank"
					>
						<MapPin color={venue.venueInfo.color} />
						{venue.title}
					</a>
				)}

				{online && (
					<a
						className="watch-link"
						href="https://youtube.com"
						target="_blank"
					>
						Watch online
					</a>
				)}
			</div>
		</Link>
	);
};

export default ProgrammeTemplate;

export const scheduleItemsQuery = graphql`
	query allEvents($edition: String!) {
		events: allWpEvent(
			sort: { order: DESC, fields: date }
			filter: {
				editions: { nodes: { elemMatch: { slug: { eq: $edition } } } }
			}
		) {
			edges {
				node {
					id
					slug
					uri
					title
					featuredImage {
						node {
							sizes
							uri
							description
							caption
							mediaDetails {
								sizes {
									name
									sourceUrl
								}
							}
						}
					}
					eventInfo {
						dates {
							date
							startTime
							endTime
						}
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
					}
				}
			}
		}
		workshops: allWpWorkshop(
			sort: { order: DESC, fields: date }
			filter: {
				editions: { nodes: { elemMatch: { slug: { eq: $edition } } } }
			}
		) {
			edges {
				node {
					id
					slug
					uri
					featuredImage {
						node {
							sizes
							uri
							description
							caption
							mediaDetails {
								sizes {
									name
									sourceUrl
								}
							}
						}
					}
				}
			}
		}
	}
`;

// export const artistsQuery = graphql`
// 	query artistsPage($edition: String!) {
// 		artists: allWpArtist(
// 			sort: { order: DESC, fields: date }
// 			filter: {
// 				editions: { nodes: { elemMatch: { slug: { eq: $edition } } } }
// 			}
// 		) {
// 			edges {
// 				node {
// 					id
// 					slug
// 					uri
// 					title
// 					language {
// 						slug
// 					}
// 					featuredImage {
// 						node {
// 							sizes
// 							uri
// 							description
// 							caption
// 							mediaDetails {
// 								sizes {
// 									name
// 									sourceUrl
// 								}
// 							}
// 						}
// 					}
// 				}
// 			}
// 		}
// 	}
// `;
