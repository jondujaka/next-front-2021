import React from "react";
import { Link } from "gatsby";
import { format, localeFormat } from "light-date";

const EventInfo = ({ event, showDetails = false }) => {
	if (!event.eventInfo || !event.eventInfo.dates) {
		return ``;
	}
	return (
		<div>
			{event.eventInfo.dates.map((date, i) => (
				<EventDates link={event.url} key={`date-${i}`} date={date} />
			))}
			<h3>
				<Link to="/" className="text-underline">
					Venue 2
				</Link>
			</h3>
			{showDetails && <EventDetails info={event.eventInfo} />}
		</div>
	);
};

export default EventInfo;

const EventDetails = ({ info }) => {
	const { format, price, capacity } = info;
	return (
		<>
			{format && <h3>Format: {format}</h3>}
			{capacity && <h3>Capacity: {capacity}</h3>}
			{price && <h3>Price: {price}</h3>}
		</>
	);
};

const EventDates = ({ date, link }) => {
	const dateobj = new Date(date.date);
	console.log(dateobj);
	const day = localeFormat(dateobj, "{EEE}");
	const month = localeFormat(dateobj, "{MMM}");
	const formatedDate = format(dateobj, "{dd}");
	return (
		<h3>
			<Link to={link} className="d-block mb-3">
				<span className="text-uppercase">{day}</span> {formatedDate}{" "}
				{month} {date.startTime} - {date.endTime} CET
			</Link>
		</h3>
	);
};
