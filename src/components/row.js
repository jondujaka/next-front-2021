import React from "react";

const Row = ({ classes, children, fullWidth=false }) => {
	return children ? (
		<section className={`${fullWidth ? `full-width` : `container`} ${classes ? classes : ``}`}>
			{children}
		</section>
	) : null;
};

export default Row;
