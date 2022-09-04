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

			if (!eventInfo.venue && venueFilter.current === `all`)
				venueMatch = true;
			if (!eventInfo.format && formatFilter.current === `all`)
				formatMatch = true;

			return venueMatch && formatMatch;
		});

		setAllEvents(newEvents);
	};

	const setUpDays = () => {
		let dayFilters = [
			{
				label: isSk ? "Všetky dni" : "All Days",
				value: "all"
			}
		];
		const allDaysInit = {};
		allEvents.forEach(event => {
			const { eventInfo } = event.node;
			if (!eventInfo.dates) {
				return;
			}

			eventInfo.dates.forEach(date => {
				if (!date.date) {
					return;
				}
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
						primitive: format(new Date(dateSlug), "{yyyy}{MM}{dd}"),
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

		// Sort events for each day

		const sortedAllDays = dayFilters.sort((a, b) => {
			if (a.value === "all" || b.value === "all") {
				return 0;
			}
			if (a.value > b.value) {
				return 1;
			}
			if (a.value < b.value) {
				return -1;
			}
			return 0;
		});
		setDayFilterItems(sortedAllDays);
		setAllDays(allDaysInit);
		isInitLoad(false);
	};

	useEffect(() => {
		setUpDays();
	}, [allEvents]);

	const isSk = lang !== `en`;
	const langSlug = lang === `en` ? `sk/` : ``;
	const translationSlug = `/${langSlug}${edition}/programme`;

	return Style.it(
		styles,
		<Layout
			style={{
				color: settings.textColor,
				textColor: settings.textColor,
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
					<h1 className="normal-line-height fw-title">
						{isSk ? `Program` : `Programme`}
					</h1>
				</div>
				<div className="col col-12">
					<Filter
						dayItems={dayFilterItems}
						handleClick={filterEvents}
						isSk={isSk}
						colors={{
							textColor: settings.textColor,
							backgroundColor: settings.backgroundColor
						}}
					/>
				</div>
			</Row>
			<Row>
				{allDays && (
					<>
						{Object.keys(allDays).length ? (
							<RenderDays
								allDays={allDays}
								dayFilter={dayFilter}
								settings={settings}
							/>
						) : (
							<div className="col col-12 mt-7">
								<h3>
									{isSk
										? `Viac info čoskoro`
										: `Info coming soon`}
								</h3>
							</div>
						)}
					</>
				)}
			</Row>
		</Layout>
	);
};

const RenderDays = ({ allDays, dayFilter, settings }) => {
	const keys = Object.keys(allDays);
	const sortedKeys = keys.sort((a, b) => {
		if (a > b) {
			return 1;
		}
		if (a < b) {
			return -1;
		}
		return 0;
	});

	return sortedKeys.map(key => {
		if (key === dayFilter || dayFilter === "all") {
			return <Day day={allDays[key]} key={key} colors={settings} />;
		}
	});
};

const Day = ({ day, colors }) => {
	day.items = day.items.sort((a, b) => {
		if(!a.date.starttime || !b.date.starttime){
			return a.menuOrder > b.menuOrder ? 1 : -1;
		}

		if(!b.date.starttime){
			return -1;
		}
		return a.date.starttime > b.date.starttime ? 1 : -1;
	});
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
	let timeStart = item.date.starttime;
	let timeEnd = item.date.endtime ? ` - ${item.date.endtime}` : ``;
	let time = timeStart ? `${timeStart}${timeEnd}` : "";
	const venue = item.eventInfo.venue ? item.eventInfo.venue : null;
	const online = item.eventInfo.livestreamUrl || "";
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

	const handleClick = e => {
		e.stopPropagation();
	};
	return Style.it(
		styles,
		<Link to={item.uri} className="schedule-item">
			<span className="item-time">{time}</span>
			<span className="item-info mt-5 mt-lg-0">{item.title} - {item.menuOrder}</span>
			<div className="item-location">
				{venue && venue.title !== "Online" && (
					<a
						className="venue-info"
						href={venue.venueInfo?.mapsLink}
						target="_blank"
						onClick={handleClick}
					>
						<MapPin color={venue.venueInfo?.color} />
						{venue.title}
					</a>
				)}

				{online.length || (venue && venue.title == "Online") ? (
					<a
						className="watch-link"
						href={online || venue.venueInfo?.mapsLink}
						target="_blank"
						onClick={handleClick}
					>
						Watch online
					</a>
				) : null}
			</div>
		</Link>
	);
};

export default ProgrammeTemplate;

export const scheduleItemsQuery = graphql`
	query allEvents($edition: String!, $lang: String!) {
		events: allWpEvent(
			sort: { order: ASC, fields: menuOrder }
			filter: {
				editions: { nodes: { elemMatch: { slug: { eq: $edition } } } }
				language: { slug: { eq: $lang } }
			}
		) {
			edges {
				node {
					id
					slug
					uri
					title
					menuOrder
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
						livestreamUrl
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
