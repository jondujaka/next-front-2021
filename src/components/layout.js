/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";

import SocialFooter from "./socialFooter";

import Header from "./header";
import "../styles/global.scss";

const Layout = ({
	children,
	settings,
	year,
	style = { color: `#000`, backgroundColor: `#FFF`, borderColor: `#000` },
	noFooter,
	editionHeader = []
}) => {
	const data = useStaticQuery(graphql`
		query SiteTitleQuery {
			site {
				siteMetadata {
					title
				}
			}
		}
	`);

	let parsedStyle = {
		...style,
		borderColor: style.color
	};

	return (
		<>
			{/* <Header siteTitle={data.site.siteMetadata?.title || `Title`} /> */}
			<div
				className={`main-wrapper ${
					year ? `edition-${year}` : `no-edition`
				}`}
				style={year ? parsedStyle : {}}
			>
				<Header />
				{/* {editionHeader.length && <EditionHeader />} */}
				<main>{children}</main>
				{noFooter ? `` : <SocialFooter />}
				<footer>© {new Date().getFullYear()}, Copyright</footer>
			</div>
		</>
	);
};

Layout.propTypes = {
	children: PropTypes.node.isRequired
};

export default Layout;
