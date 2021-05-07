import React from "react";

const Row = ({ classes, children, fullWidth=false }) => {
	return children ? (
		<section className={`${fullWidth ? `full-width` : `row`} ${classes ? classes : ``}`}>
			{children}
		</section>
	) : null;
};

export default Row;
