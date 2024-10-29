import React, { useEffect } from "react";
import { Link, navigate } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import Style from "style-it";
import Helmet from "react-helmet";

const TicketsTemplate = ({ pageContext }) => {
	const { settings, edition, menu, lang, skMenu } = pageContext;

	const isSk = lang !== `en`;

	const langSlug = lang === `en` ? `sk/` : ``;
	const translationSlug = `/${langSlug}${edition}/tickets`;

	useEffect(() => {
		const script = document.createElement("script");

		script.src =
			"https://partners.goout.net/sk-bratislava/nextfestivalsk.js?v=1.1";
		script.type = "text/javascript";
		script.async = true;

		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	return (
		<Layout
			style={{
				color: settings.textColor,
				textColor: settings.textColor,
				backgroundColor: settings.backgroundColor
			}}
			isSk={isSk}
			translationSlug={translationSlug}
			editionHeader={menu}
			skMenu={skMenu}
			year={edition}
			pageName={isSk ? `Lístky` : `Tickets`}
		>
			<Row>
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
