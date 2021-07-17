import React from "react";
import { Link } from "gatsby";

const CustomLink = ({link, children, withArrow}) => {
	return <Link to={link}>{children}{withArrow && ` ⟶`}</Link>;
};

export default CustomLink;