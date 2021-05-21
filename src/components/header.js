import * as React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
import { useAppState } from "./context";

const Header = ({ siteTitle }) => {
	const { cart } = useAppState();
	console.log(cart);
	return (
		<div>
			<header>Header</header>
			<span>{cart ? cart.contents.itemCount : ``}</span>
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
