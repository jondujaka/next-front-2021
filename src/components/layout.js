/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";

import SocialFooter from './socialFooter';

import Header from "./header";
import "../styles/global.scss";                                                                                                                                                                                                                                                   

const Layout = ({ children, settings, year, style={color: `#000`, backgroundColor: `#FFF`} }) => {
	const data = useStaticQuery(graphql`
		query SiteTitleQuery {
			site {
				siteMetadata {
					title
				}
			}
		}
	`);

	console.log(year);

	return (
		<>
			{/* <Header siteTitle={data.site.siteMetadata?.title || `Title`} /> */}
			<div
				className={`main-wrapper ${year ? `edition-${year}` : `no-edition`}`}
				style={year ? style : {}}
			>
				<main>{children}</main>
				<SocialFooter/>
				<footer
					style={{
						marginTop: `2rem`
					}}
				>
					© {new Date().getFullYear()}, Copyright
				</footer>
			</div>
		</>
	);
};

Layout.propTypes = {
	children: PropTypes.node.isRequired
};

export default Layout;
