import React from "react";
import { Link } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import Style from "style-it";

const TicketsTemplate = ({ pageContext }) => {
	const { settings, edition, menu } = pageContext;
	const ticketList = [
		{
			title: "7-Day Ticket 2021",
			price: "80",
			description:
				"7 day entry to the festival & all festival venues and description of everything included in the price."
		},
		{
			title: "5-Day Ticket 2021",
			price: "60",
			description:
				"5 day entry to the festival & all festival venues and description of everything included in the price."
		},
		{
			title: "3-Day Ticket 2021",
			price: "16",
			description:
				"3 day entry to the festival & all festival venues and description of everything included in the price."
		},
		{
			title: "1-Day Ticket 2021",
			price: "10",
			description:
				"1 day entry to the festival & all festival venues and description of everything included in the price."
		}
	];

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
					<h1 className="normal-line-height fw-title">Tickets</h1>
				</div>
			</Row>
			<Row classes="justify-content-start">
				{ticketList &&
					ticketList.map(ticket => (
						<TicketItem key={ticket.price} colors={settings} ticket={ticket} />
					))}
			</Row>
		</Layout>
	);
};

const TicketItem = ({ ticket, colors }) => {
	const styles = colors ? `
		.ticket-block:hover {
			color: ${colors.backgroundColor};
			background: ${colors.textColor};
		}
	` : ``;
	return Style.it(
		styles,
		<div className="col col-12 col-lg-6 mb-6">
			<Link to="/" className="ticket-block px-5 py-5 px-lg-6 py-lg-5">
				<h3 className="big mb-2 mb-lg-4">{ticket.title}</h3>
				<h3 className="big mb-2 mb-lg-4">€{ticket.price}</h3>
				<p>{ticket.description}</p>
			</Link>
		</div>
	);
};

export default TicketsTemplate;
