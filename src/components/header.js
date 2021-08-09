import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useStaticQuery, graphql } from "gatsby";
import { useAppState } from "./context";

const Header = ({ siteTitle, noLang, isSk, translationSlug }) => {
	const { cart } = useAppState();

	const [mobileNavOpen, setMobileNavOpen] = useState(false);

	const closeMobileNav = () => {
		setMobileNavOpen(false);

		if (document) {
			let body = document.getElementsByTagName("body");
			body[0].classList.remove("overflow-hidden");
		}
	};

	const openMobileNav = () => {
		let windowW = window.innerWidth;

		if (document) {
			let body = document.getElementsByTagName("body");
			body[0].classList.add("overflow-hidden");
		}

		if (windowW < 1130) {
			setMobileNavOpen(true);
		}
	};
	return (
		<>
			<div
				className={`header-wrapper ${
					mobileNavOpen ? `open` : `closed`
				}`}
			>
				<Link
					to="/"
					className="next-button desktop"
					activeClassName="active"
				>
					Next
				</Link>

				<nav className="main-nav desktop">
					<MainMenuLinks
						cart={cart}
						noLang={noLang}
						translationSlug={translationSlug}
						isSk={isSk}
					/>
				</nav>

				<div className="main-nav-mobile">
					<MainMenuLinks
						cart={cart}
						noLang={noLang}
						translationSlug={translationSlug}
						isSk={isSk}
						mobile
					/>
				</div>
			</div>
			<button
				onClick={openMobileNav}
				className={`next-button mobile ${
					mobileNavOpen ? `hide` : `show`
				}`}
			>
				Next
			</button>
			<button
				className={`close-button ${mobileNavOpen ? `show` : `hide`}`}
				onClick={closeMobileNav}
			>
				X
			</button>
		</>
	);
};

const MainMenuLinks = ({ cart, noLang, mobile, translationSlug, isSk }) => {
	const data = useStaticQuery(graphql`
		query MainMenusQuery {
			allWpMenu(filter: { slug: { regex: "/^main-navigation/" } }) {
				edges {
					node {
						slug
						menuItems {
							nodes {
								url
								label
							}
						}
					}
				}
			}
		}
	`);

	const menus = data.allWpMenu.edges;

	const menuSlug = isSk ? `main-navigation-sk` : `main-navigation`;
	const menuItems = menus.find(menu => menu.node.slug === menuSlug).node.menuItems.nodes;

	return (
		<ul>
			{mobile && (
				<li>
					<Link to={getMenuUrl(`/`, isSk)} activeClassName="active">
						Next
					</Link>
				</li>
			)}
			{menuItems.length && menuItems.map(item => <li><Link
					to={item.url}
					partiallyActive
					activeClassName="active"
					key={`${item.url}-${mobile ? `mobile` : `desktop`}`}
				>
					{item.label}
				</Link>
				</li>
			)}
			{cart?.content?.itemCount ? (
				<li>
					<Link
						to="/cart"
						className="cart-header"
						partiallyActive
						activeClassName="active"
					>
						Cart - {cart.contents.itemCount}
					</Link>
				</li>
			) : (
				``
			)}
			{!noLang && translationSlug && (
				<li>
					<Link to={translationSlug} className="lang-switcher">
						{isSk ? `EN` : `SK`}
					</Link>
				</li>
			)}
		</ul>
	);
};

const getMenuUrl = (url, isSk) => (isSk ? `/sk${url}` : url);

Header.propTypes = {
	siteTitle: PropTypes.string
};

Header.defaultProps = {
	siteTitle: ``
};

export default Header;
