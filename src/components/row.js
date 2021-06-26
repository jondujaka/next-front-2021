import React from "react";

const Row = ({ id, classes, children, fullWidth = false }) => {
	return children ? (
		<section
			id={id ? id : ``}
			className={`${fullWidth ? `full-width` : `row`} ${
				classes ? classes : ``
			}`}
		>
			{children}
		</section>
	) : null;
};

export default Row;
