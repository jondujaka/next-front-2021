import React from "react";
import { Link } from "gatsby";
import { format, localeFormat } from "light-date";
import ExternalIcon from "./externalIcon";

const EventInfo = ({ event, showDetails = false }) => {
	if (!event.eventInfo || !event.eventInfo.dates) {
		return ``;
	}
	const venue = event.eventInfo.venue ? event.eventInfo.venue : null;
	return (
		<div className="mb-6">
			{event.eventInfo.dates.map((date, i) => (
				<EventDates link={event.url} key={`date-${i}`} date={date} />
			))}
			{venue && (
				<a
					target="_blank"
					rel="noreferrer noopener"
					href={venue.venueInfo?.mapsLink}
					className="big"
				>
					{venue.title}
				</a>
			)}
			{showDetails && <EventDetails info={event.eventInfo} />}
		</div>
	);
};

export default EventInfo;

const EventDetails = ({ info }) => {
	const { format, price, capacity } = info;
	return (
		<div className="mt-2 mt-lg-4 mt-xxl-6">
			{format?.slug && (
				<span className="big d-block">Format: {format.name}</span>
			)}
			{capacity && (
				<span className="big d-block">Capacity: {capacity}</span>
			)}
			{price && (
				<span className="big d-block">
					Registration fee: {price ? `${price} EUR` : `Free`}
				</span>
			)}
		</div>
	);
};

const EventDates = ({ date, link }) => {
	const dateobj = new Date(date.date);
	const day = localeFormat(dateobj, "{EEE}");
	const month = localeFormat(dateobj, "{MMM}");
	const formatedDate = format(dateobj, "{dd}");

	if (link) {
		return (
			<Link to={link ? link : "/"} className="big d-block">
				<span className="text-uppercase">{day}</span> {formatedDate}{" "}
				{month} {date.starttime} - {date.endtime} CET
			</Link>
		);
	}
	return (
		<span className="big d-block">
			<span className="text-uppercase">{day}</span> {formatedDate} {month}{" "}
			{date.starttime}
			{date.endTime && ` - ${date.endtime}`} CET
		</span>
	);
};
