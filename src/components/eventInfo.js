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
					mapsLink: `https://www.google.com/maps/place/World+Fashion+Centre/@52.3577347,4.8531381,14z/data=!4m5!3m4!1s0x47c5e218eb7d69d7:0x794faa28d5d5ef!8m2!3d52.3546016!4d4.8409488`
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
				className="big with-icon with-underline"
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
			{format.slug && <span className="big d-block">Format: {format.name}</span>}
			{capacity && (
				<span className="big d-block">Capacity: {capacity}</span>
			)}
			<span className="big d-block">
				Registration fee: {price ? `${price} EUR}` : `Free`}
			</span>
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
