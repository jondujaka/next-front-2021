/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";
import Helmet from 'react-helmet';

import SocialFooter from "./socialFooter";

import Header from "./header";
import EditionMenu from "./editionMenu";
import "../styles/global.scss";

const Layout = ({
	children,
	settings,
	year,
	style = { color: `#000`, backgroundColor: `#FFF`, borderColor: `#000` },
	embeded,
	editionHeader = {},
	skMenu = {
		menuItems: []
	},
	translationSlug,
	isSk,
	pageName=``
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
		<Helmet
			htmlAttributes={{
				lang: 'en'
			}}
			title={pageName}
			meta={[
				// {
				// 	name: `description`,
				// 	content: metaDescription
				// },
				// {
				// 	property: `og:title`,
				// 	content: pageName
				// },
				// {
				// 	property: `og:description`,
				// 	content: metaDescription
				// },
				// {
				// 	property: `og:type`,
				// 	content: `website`
				// },
				// {
				// 	name: `twitter:card`,
				// 	content: `summary`
				// },
				// {
				// 	name: `twitter:creator`,
				// 	content: site.siteMetadata?.author || ``
				// },
				// {
				// 	name: `twitter:title`,
				// 	content: title
				// },
				// {
				// 	name: `twitter:description`,
				// 	content: metaDescription
				// }
			]}
		/>
			{/* <Header siteTitle={data.site.siteMetadata?.title || `Title`} /> */}
			<div
				className={`main-wrapper ${
					year ? `edition-${year} menu-padding edition-web` : `no-edition festival-web`
				}`}
				id="main-wrapper"
				style={year ? parsedStyle : {}}
			>
				{!embeded && <Header noLang={editionHeader.menuItems || false} isSk={isSk} translationSlug={translationSlug}/> }
				{editionHeader && editionHeader.menuItems && (
					<EditionMenu
						items={editionHeader.menuItems}
						skMenu={skMenu.menuItems}
						bg={style.backgroundColor}
						translationSlug={translationSlug}
						isSk={isSk}
						pageName={pageName}
						sticky={embeded}
					/>
				)}
				<main>{children}</main>
				{embeded ? `` : <SocialFooter />}
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
