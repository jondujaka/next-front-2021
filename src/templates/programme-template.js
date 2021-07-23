import React, { useState, useEffect } from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import MapPin from "../components/mapPin";
import { format, localeFormat } from "light-date";
import Style from 'style-it';

const ProgrammeTemplate = ({ data, pageContext }) => {
	// const artistsList = data.artists.edges;
	const { settings, edition, menu } = pageContext;
	console.log(data);

	const allEvents = data.events.edges;
	const allDays = {};


	const styles = settings ? `
		.schedule-item:hover {
			color: ${settings.backgroundColor};
			background: ${settings.textColor};
		}
	` : ``;

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

	return Style.it(styles,
		<Layout
			style={{
				color: settings.textColor,
				backgroundColor: settings.backgroundColor
			}}
			editionHeader={menu}
			year={edition}
		>
			<Row fullWidth>
				<div className="col col-12 px-0">
					<h1 className="normal-line-height fw-title border-bottom-thick">
						Programme
					</h1>
				</div>
			</Row>
			<Row>
				{allDays &&
					Object.keys(allDays).map(key => (
						<Day
							day={allDays[key]}
							key={key}
							colors={settings}
						/>
					))}
			</Row>
		</Layout>
	);
};

const Day = ({ day, colors }) => {
	return (
		<div id={day.slug} className="col col-12 day-wrapper px-0">
			<h5 className="day-title fw-title" style={{ background: colors.backgroundColor }}>
				{day.name}
			</h5>
			<div className="schedule-items-wrapper">
				{day.items.map(item => (
					<ScheduleItem key={item.slug} item={item} colors={colors} />
				))}
			</div>
		</div>
	);
};

const ScheduleItem = ({ item, colors }) => {
	let time = `${item.date.startTime} - ${item.date.endTime}`;
	const venue = item.eventInfo.venues ? item.eventInfo.venues[0] : null;
	const online = true;
	const styles = colors ? `
		.schedule-item:hover,
		.watch-link:hover {
			color: ${colors.backgroundColor};
			background: ${colors.textColor};
		}
		.watch-link:hover {
			color: ${colors.backgroundColor} !important;
			background: ${colors.textColor} !important;
		}
		.schedule-item:hover .watch-link {
			background: ${colors.backgroundColor};
			color: ${colors.textColor};
		}
	` : ``;
	return Style.it(styles,
		<Link to={item.uri} className="schedule-item">
			<span className="item-time">{time}</span>
			<span className="item-info mt-5 mt-lg-0">{item.title}</span>
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
						format {
							slug
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
