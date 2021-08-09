/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React, { useEffect } from "react";
import { useAppState } from "../components/context";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";
import Helmet from "react-helmet";
import { gql, useLazyQuery, useMutation } from "@apollo/client";

import SocialFooter from "./socialFooter";

import Header from "./header";
import Row from "./row";
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
	pageName = ``
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

	const { cart, setCart } = useAppState();
	const [maybeGetCart, { loading }] = useLazyQuery(CART, {
		onCompleted: ({ cart }) => {
			setCart(cart);
		}
	});

	useEffect(() => {
		if (cart) {
			return;
		}

		maybeGetCart();
	}, [cart, maybeGetCart]);

	let parsedStyle = {
		...style,
		borderColor: style.color
	};

	return (
		<>
			<Helmet
				htmlAttributes={{
					lang: "en"
				}}
				title={pageName}
				meta={
					[
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
					]
				}
			/>
			{/* <Header siteTitle={data.site.siteMetadata?.title || `Title`} /> */}
			<div
				className={`main-wrapper ${
					year
						? `edition-${year} menu-padding edition-web`
						: `no-edition festival-web`
				}`}
				id="main-wrapper"
				style={year ? parsedStyle : {}}
			>
				{!embeded && (
					<Header
						noLang={editionHeader.menuItems || false}
						isSk={isSk}
						translationSlug={translationSlug}
					/>
				)}
				{editionHeader && editionHeader.menuItems && (
					<EditionMenu
						items={editionHeader.menuItems}
						skMenu={skMenu.menuItems}
						bg={style.backgroundColor}
						translationSlug={translationSlug}
						isSk={isSk}
						pageName={pageName}
						sticky={embeded}
						colors={parsedStyle}
					/>
				)}
				<main>{children}</main>
				{embeded ? `` : <SocialFooter />}
				{embeded ? (
					``
				) : (
					<footer>
						<Row>
							<div className="col col-12">
								<span className="credits">
									Website designed by{" "}
									<a
										href="https://robertfinkei.com"
										target="_blank"
									>
										Robert Finkei
									</a>{" "}
									and developed by{" "}
									<a href="mailto:jdujaka@gmail.com">
										Jon Dujaka
									</a>
									.
								</span>
							</div>
						</Row>
					</footer>
				)}
			</div>
		</>
	);
};

Layout.propTypes = {
	children: PropTypes.node.isRequired,
	translationSlug: PropTypes.string,
	isSk: PropTypes.bool
};

const CART = gql`
	query Cart {
		cart {
			subtotal
			total
			shippingTotal
			contents {
				itemCount
				nodes {
					quantity
					product {
						node {
							name
							sku
							databaseId
							... on VariableProduct {
								productInfo {
									subtitle
								}
								featuredImage {
									node {
										srcSet
									}
								}
							}
							... on SimpleProduct {
								price
								productInfo {
									subtitle
								}
								featuredImage {
									node {
										srcSet
									}
								}
							}
						}
					}
					variation {
						node {
							price
							attributes {
								nodes {
									value
									name
								}
							}
						}
					}
				}
			}
		}
	}
`;

export default Layout;
