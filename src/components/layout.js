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
import EditionMenu from "./editionMenu";
import "../styles/global.scss";

const Layout = ({
	children,
	settings,
	year,
	style = { color: `#000`, backgroundColor: `#FFF`, borderColor: `#000` },
	noFooter,
	editionHeader = {},
	skMenu = {
		menuItems: []
	},
	translationSlug,
	isSk
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
					year ? `edition-${year} menu-padding edition-web` : `no-edition festival-web`
				}`}
				style={year ? parsedStyle : {}}
			>
				<Header noLang={editionHeader.menuItems || false}/>
				{editionHeader && editionHeader.menuItems && (
					<EditionMenu
						items={editionHeader.menuItems}
						skMenu={skMenu.menuItems}
						bg={style.backgroundColor}
						translationSlug={translationSlug}
						isSk={isSk}
					/>
				)}
				<main>{children}</main>
				{noFooter ? `` : <SocialFooter />}
				<footer>© {new Date().getFullYear()}, Copyright</footer>
			</div>
		</>
	);
};

Layout.propTypes = {
	children: PropTypes.node.isRequired,
	translationSlug: PropTypes.string,
	isSk: PropTypes.bool
};

export default Layout;
