import React from "react";
import { Link } from "gatsby";

const CustomLink = ({link, children}) => {
	return <Link to={link}>{children} ⟶</Link>;
};

export default CustomLink;