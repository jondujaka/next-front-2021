import React from "react";
import { Link } from "gatsby";

const LangSwitcher = ({ link, text }) => {
	// let url = item.uri === `/home/` ? `/` : item.uri;

	return <Link to={link}>{text}</Link>;
};

export default LangSwitcher;
