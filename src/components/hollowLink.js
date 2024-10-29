import React from "react";

const HollowLink = React.forwardRef(({ text, link }, ref) => {
	return (
		<a className="hollow-link" ref={ref} href={link}>
			{text}
		</a>
	);
});
export default HollowLink;
