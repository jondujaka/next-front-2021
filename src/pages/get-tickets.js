import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import Row from "../components/row";
import Helmet from 'react-helmet';

const GetTickets = ({ pageContext }) => {

	return (
		<Layout pageName="Tickets">
			<Helmet>
				<script src="https://partners.goout.net/sk-bratislava/nextfestivalsk.js" type="text/javascript" />
			</Helmet>
			<Row>
				<div className="col col-12 px-0">
					<h1 className="normal-line-height fw-title">Tickets</h1>
				</div>
			</Row>
		</Layout>
	);
};

export default GetTickets;
