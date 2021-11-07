import React from "react";
import { Link, navigate } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import Style from "style-it";
import Helmet from "react-helmet";

const TicketsTemplate = ({ pageContext }) => {
	const { settings, edition, menu, lang, skMenu } = pageContext;

	const isSk = lang !== `en`;

	if (isSk) {
		navigate("/2021/tickets");
	}
	const langSlug = lang === `en` ? `sk/` : ``;
	const translationSlug = `/${langSlug}${edition}/tickets`;

	return (
		<Layout
			style={{
				color: settings.textColor,
				textColor: settings.textColor,
				backgroundColor: settings.backgroundColor
			}}
			isSk={isSk}
			// translationSlug={translationSlug}
			editionHeader={menu}
			skMenu={skMenu}
			year={edition}
			pageName={isSk ? `Lístky` : `Tickets`}
		>
			<Row>
				<Helmet>
					<script
						src="https://partners.goout.net/sk-bratislava/nextfestivalsk.js"
						type="text/javascript"
					/>
				</Helmet>
				<div className="col col-12 px-0">
					<h1 className="normal-line-height fw-title">
						{isSk ? `Lístky` : `Tickets`}
					</h1>
				</div>
			</Row>
		</Layout>
	);
};

export default TicketsTemplate;
