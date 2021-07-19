import React from "react";
import { Link } from "gatsby";
import Style from 'style-it';

const CustomLink = ({ link, children, withArrow, classes, colors }) => {
	const styles = colors
		? `
			.see-all-link:hover {
				color: ${colors.backgroundColor};
				background: ${colors.textColor};
			}
		`: ``;
	return Style.it(styles,
		<Link className={`with-underline ${classes ? classes : ``}`} to={link}>
			{children}
			{withArrow && ` ⟶`}
		</Link>
	);
};

export default CustomLink;
