import React from "react";
import { Link } from "gatsby";
import { format, localeFormat } from "light-date";
import ExternalIcon from "./externalIcon";

const EventInfo = ({ event, showDetails = false }) => {
	if (!event.eventInfo || !event.eventInfo.dates) {
		return ``;
	}
	const venue = event.eventInfo.venues
		? event.eventInfo.venues[0]
		: {
				venueInfo: {
					mapsLink: `https://maps.google.com`,
					color: `red`,
				},
				title: `Fake venue`
		  };
	return (
		<div className="mb-6">
			{event.eventInfo.dates.map((date, i) => (
				<EventDates link={event.url} key={`date-${i}`} date={date} />
			))}
			<a
				target="_blank"
				rel="noreferrer noopener"
				href={venue.venueInfo.mapsLink}
				style={{ color: venue.venueInfo.color }}
				className="big text-underline with-icon"
			>
				{venue.title}
			</a>
			{showDetails && <EventDetails info={event.eventInfo} />}
		</div>
	);
};

export default EventInfo;

const EventDetails = ({ info }) => {
	const { format, price, capacity } = info;
	return (
		<div className="mt-2 mt-lg-4 mt-xxl-6">
			{format && <span className="big d-block">Format: {format}</span>}
			{capacity && (
				<span className="big d-block">Capacity: {capacity}</span>
			)}
			{price && <span className="big d-block">Price: {price}</span>}
		</div>
	);
};

const EventDates = ({ date, link }) => {
	const dateobj = new Date(date.date);
	console.log(dateobj);
	const day = localeFormat(dateobj, "{EEE}");
	const month = localeFormat(dateobj, "{MMM}");
	const formatedDate = format(dateobj, "{dd}");

	if (link) {
		return (
			<Link to={link ? link : "/"} className="big d-block">
				<span className="text-uppercase">{day}</span> {formatedDate}{" "}
				{month} {date.startTime} - {date.endTime} CET
			</Link>
		);
	}
	return (
		<span className="big d-block">
			<span className="text-uppercase">{day}</span> {formatedDate} {month}{" "}
			{date.startTime} - {date.endTime} CET
		</span>
	);
};
