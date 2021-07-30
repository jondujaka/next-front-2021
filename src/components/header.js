import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
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
			console.log("in here");
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
	return (
		<ul>
			{mobile && (
				<li>
					<Link to={getMenuUrl(`/`, isSk)} activeClassName="active">
						Next
					</Link>
				</li>
			)}
			<li>
				<Link
					to={getMenuUrl(`/news`, isSk)}
					partiallyActive
					activeClassName="active"
				>
					News
				</Link>
			</li>
			<li>
				<Link
					to={getMenuUrl(`/about`, isSk)}
					partiallyActive
					activeClassName="active"
				>
					About
				</Link>
			</li>
			<li>
				<Link
					to={getMenuUrl(`/2021`, isSk)}
					partiallyActive
					activeClassName="active"
				>
					Festival '21
				</Link>
			</li>
			<li>
				<Link
					to={getMenuUrl(`/commissions`, isSk)}
					partiallyActive
					activeClassName="active"
				>
					Commissions
				</Link>
			</li>
			<li>
				<Link
					to={getMenuUrl(`/projects`, isSk)}
					partiallyActive
					activeClassName="active"
				>
					Projects
				</Link>
			</li>
			<li>
				<Link
					to={getMenuUrl(`/records`, isSk)}
					partiallyActive
					activeClassName="active"
				>
					Records
				</Link>
			</li>
			<li>
				<Link
					to={getMenuUrl(`/archive`, isSk)}
					partiallyActive
					activeClassName="active"
				>
					Archive
				</Link>
			</li>
			<li>
				<Link
					to={getMenuUrl(`/shop`, isSk)}
					partiallyActive
					activeClassName="active"
				>
					Shop
				</Link>
			</li>
			{cart ? (
				<li>
					<Link
						to="/cart"
						className="cart-header"
						partiallyActive
						activeClassName="active"
					>Cart - {cart.contents.itemCount}
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
