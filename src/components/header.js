import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
import { useAppState } from "./context";

const Header = ({ siteTitle, noLang }) => {
	const { cart } = useAppState();

	const [mobileNavOpen, setMobileNavOpen] = useState(false);

	const closeMobileNav = () => {
		setMobileNavOpen(false);

		if(document){
			let body = document.getElementsByTagName('body');
			body[0].classList.remove('overflow-hidden')
		}
	};

	const openMobileNav = () => {
		let windowW = window.innerWidth;

		if(document){
			let body = document.getElementsByTagName('body');
			body[0].classList.add('overflow-hidden')
		}

		if (windowW < 1130) {
			console.log('in here')
			setMobileNavOpen(true);
		}
	};
	return (
		<>
			<div
				className={`header-wrapper ${mobileNavOpen ? `open` : `closed`}`}
			>
				<Link
					to="/"
					className="next-button desktop"
					activeClassName="active"
				>
					Next
				</Link>

				<nav className="main-nav desktop">
					<MainMenuLinks cart={cart} noLang={noLang} />
				</nav>

				<div className="main-nav-mobile">
					<MainMenuLinks cart={cart} noLang={noLang} mobile />
					
				</div>
			</div>
			<button
				onClick={openMobileNav}
				className={`next-button mobile ${mobileNavOpen ? `hide` : `show`}`}
			>
				Next
			</button>
			<button className={`close-button ${mobileNavOpen ? `show` : `hide`}`} onClick={closeMobileNav}>
				X
			</button>
		</>
	);
};

const MainMenuLinks = ({ cart, noLang, mobile }) => {
	return (
		<ul>
			{mobile && (
				<li>
					<Link to="/" activeClassName="active">
						Next
					</Link>
				</li>
			)}
			<li>
				<Link to="/news/" partiallyActive activeClassName="active">
					News
				</Link>
			</li>
			<li>
				<Link to="/about/" partiallyActive activeClassName="active">
					About
				</Link>
			</li>
			<li>
				<Link to="/2021/" partiallyActive activeClassName="active">
					Festival '21
				</Link>
			</li>
			<li>
				<Link
					to="/commissions/"
					partiallyActive
					activeClassName="active"
				>
					Commissions
				</Link>
			</li>
			<li>
				<Link to="/projects/" partiallyActive activeClassName="active">
					Projects
				</Link>
			</li>
			<li>
				<Link to="/records" partiallyActive activeClassName="active">
					Records
				</Link>
			</li>
			<li>
				<Link to="/archive/" partiallyActive activeClassName="active">
					Archive
				</Link>
			</li>
			<li>
				<Link to="/shop/" partiallyActive activeClassName="active">
					Shop
				</Link>
			</li>
			{cart ? (
				<li>
					<Link to="/cart/" class>
						Name="cart-header" partiallyActive
						activeClassName="active" > Cart -{" "}
						{cart.contents.itemCount}
					</Link>
				</li>
			) : (
				``
			)}
			{!noLang && (
				<li>
					<Link to="/" className="lang-switcher">
						SK
					</Link>
				</li>
			)}
		</ul>
	);
};

Header.propTypes = {
	siteTitle: PropTypes.string
};

Header.defaultProps = {
	siteTitle: ``
};

export default Header;
