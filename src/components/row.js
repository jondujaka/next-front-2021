import React from "react";

const Row = ({ id, classes, children, fullWidth = false, alignEnd }) => {
	return children ? (
		<section
			id={id ? id : ``}
			className={`${fullWidth ? `full-width` : `row`} ${
				classes ? classes : ``
			} ${alignEnd ? `align-items-end` : ``}`}
		>
			{children}
		</section>
	) : null;
};

export default Row;
