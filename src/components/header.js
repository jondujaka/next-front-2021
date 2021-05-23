import * as React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
import { useAppState } from "./context";

const Header = ({ siteTitle }) => {
	const { cart } = useAppState();
	console.log(cart);
	return (
		<div className="header-wrapper">
			<h4>Next</h4>
			<nav className="main-nav">
				<ul>
					<li>
						<Link to="/">News</Link>
						<Link to="/">About</Link>
						<Link to="/">Festival '21</Link>
						<Link to="/">Commissions</Link>
						<Link to="/">Projects</Link>
						<Link to="/">Records</Link>
						<Link to="/">Archive</Link>
						<Link to="/">Shop</Link>
						{cart ? <Link to="/cart" className="cart-header">Cart - {cart.contents.itemCount}</Link> : ``}
						<Link to="/" className="lang-swither">SK</Link>
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
