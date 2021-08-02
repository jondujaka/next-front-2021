import React, { useState, useRef, useEffect } from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import MapPin from "../components/mapPin";
import Filter from "../components/filter";
import { format, localeFormat } from "light-date";
import Style from "style-it";

const ProgrammeTemplate = ({ data, pageContext }) => {
	// const artistsList = data.artists.edges;
	const { settings, edition, menu, lang, skMenu } = pageContext;

	const initEvents = data.events.edges;
	const [allDays, setAllDays] = useState([]);

	const [initLoad, isInitLoad] = useState(true);

	const [allEvents, setAllEvents] = useState(initEvents);

	const [dayFilter, setDayFilter] = useState("all");
	const venueFilter = useRef("all");
	const formatFilter = useRef("all");

	const [dayFilterItems, setDayFilterItems] = useState([]);

	const styles = settings
		? `
		.schedule-item:hover {
			color: ${settings.backgroundColor};
			background: ${settings.textColor};
		}
	`
		: ``;

	const filterEvents = (slug, type) => {
		console.log(slug);

		if (type === `day`) {
			setDayFilter(slug);
		}
		if (type === `venue`) {
			venueFilter.current = slug;
		}
		if (type === `format`) {
			formatFilter.current = slug;
		}

		let newEvents = initEvents.filter(eventObj => {
			const eventInfo = eventObj.node.eventInfo;
			let venueMatch =
				eventInfo.venue &&
				(venueFilter.current === "all" ||
				eventInfo.venue.slug === venueFilter.current);

			let formatMatch =
				eventInfo.format &&
				(formatFilter.current === "all" ||
					eventInfo.format.slug === formatFilter.current);

			if (!eventInfo.venue && venueFilter.current === `all`) venueMatch = true;
			if (!eventInfo.format && formatFilter.current === `all`) formatMatch = true;

			return venueMatch && formatMatch;
		});

		setAllEvents(newEvents);
		isInitLoad(false);
	};

	const setUpDays = () => {
		console.log("asd");
		let dayFilters = [{
			label: "All Days",
			value: "all"
		}];
		const allDaysInit = {};
		allEvents.forEach(event => {
			console.log("creating days again?");
			const { eventInfo } = event.node;
			if (!eventInfo.dates) {
				return;
			}

			eventInfo.dates.forEach(date => {
				let dateSlug = date.date;

				if (!allDaysInit.hasOwnProperty(dateSlug)) {
					const dateobj = new Date(date.date);
					const dayName = localeFormat(dateobj, "{EEE}");
					const monthName = localeFormat(dateobj, "{MMM}");
					const dayNr = format(dateobj, `{dd}`);

					const dayTitle = `${dayName} ${dayNr} ${monthName}`;
					allDaysInit[dateSlug] = {
						name: dayTitle,
						slug: dateSlug,
						items: []
					};

					dayFilters.push({
						value: dateSlug,
						label: dayTitle
					});
				}

				let simplifiedEvent = {
					...event.node,
					date: eventInfo.dates.find(date => date.date === dateSlug)
				};
				allDaysInit[dateSlug].items.push(simplifiedEvent);
			});
		});
		setDayFilterItems(dayFilters);
		setAllDays(allDaysInit);
	};

	useEffect(() => {
		setUpDays();
	}, [allEvents]);

	const isSk = lang !== `en`;
	const langSlug = lang ===`en` ? `sk/` : ``;
	const translationSlug = `/${langSlug}${edition}/programme`;

	return Style.it(
		styles,
		<Layout
			style={{
				color: settings.textColor,
				backgroundColor: settings.backgroundColor
			}}
			editionHeader={menu}
			skMenu={skMenu}
			translationSlug={translationSlug}
			isSk={isSk}
			year={edition}
			pageName={isSk ? `Program` : `Programme`}

		>
			<Row fullWidth classes="border-bottom-thick">
				<div className="col col-12 px-0">
					<h1 className="normal-line-height fw-title">{isSk ? `Program` : `Programme`}</h1>
				</div>
				<div className="col col-12">
					<Filter
						dayItems={dayFilterItems}
						handleClick={filterEvents}
						colors={{
							textColor: settings.textColor,
							backgroundColor: settings.backgroundColor
						}}
					/>
				</div>
			</Row>
			<Row>
				{allDays &&
					Object.keys(allDays).length ? Object.keys(allDays).map(key => {
						if (key === dayFilter || dayFilter === "all") {
							return (
								<Day
									day={allDays[key]}
									key={key}
									colors={settings}
								/>
							);
						}
					}) : <div className="col col-12 mt-7"><h3>{initLoad ? `Loading the programme...` : `Sorry, there are no events with the selected filters.`}</h3></div>
				}
			</Row>
		</Layout>
	);
};

const Day = ({ day, colors }) => {
	return (
		<div id={day.slug} className="col col-12 day-wrapper px-0">
			<h5
				className="day-title fw-title"
				style={{ background: colors.backgroundColor }}
			>
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
	let time = `${item.date.starttime} - ${item.date.endtime}`;
	const venue = item.eventInfo.venue ? item.eventInfo.venue : null;
	const online = true;
	const styles = colors
		? `
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
	`
		: ``;
	return Style.it(
		styles,
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
	query allEvents($edition: String!, $lang: String!) {
		events: allWpEvent(
			sort: { order: DESC, fields: date }
			filter: {
				editions: { nodes: { elemMatch: { slug: { eq: $edition } } } }
				language: {slug: {eq: $lang}}
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
							starttime
							endtime
						}
						format {
							slug
						}
						venue {
							... on WpVenue {
								id
								slug
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