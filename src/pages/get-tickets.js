import React from "react";
import Layout from "../components/layout";
import Row from "../components/row";

const GetTickets = ({ pageContext }) => {
	return (
		<Layout
			pageName={isSk ? `Lístky` : `Tickets`}
			
		>
			<Row>
				<div className="col col-12 px-0">
					<h1 className="normal-line-height fw-title">Tickets</h1>
				</div>
			</Row>
		</Layout>
		
	);
};


export default GetTickets;
