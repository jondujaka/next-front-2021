import * as React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
import { useAppState } from "./context";

const Header = ({ siteTitle, noLang }) => {
	const { cart } = useAppState();
	return (
		<div className="header-wrapper">
			<Link to="/" activeClassName="active">Next</Link>
			<nav className="main-nav">
				<ul>
					<li>
						<Link to="/news/" partiallyActive activeClassName="active">News</Link>
						<Link to="/about/" partiallyActive activeClassName="active">About</Link>
						<Link to="/2021/" partiallyActive activeClassName="active">Festival '21</Link>
						<Link to="/commissions/" partiallyActive activeClassName="active">Commissions</Link>
						<Link to="/projects/" partiallyActive activeClassName="active">Projects</Link>
						<Link to="/records" partiallyActive activeClassName="active">Records</Link>
						<Link to="/archive/" partiallyActive activeClassName="active">Archive</Link>
						<Link to="/shop/" partiallyActive activeClassName="active">Shop</Link>
						{cart ? <Link to="/cart/" className="cart-header" partiallyActive activeClassName="active">Cart - {cart.contents.itemCount}</Link> : ``}
						{!noLang && <Link to="/" className="lang-switcher">SK</Link>}
					</li>
				</ul>
			</nav>
		</div>
	);
};

Header.propTypes = {
	siteTitle: PropTypes.string
};

Header.defaultProps = {
	siteTitle: ``
};

export default Header;
