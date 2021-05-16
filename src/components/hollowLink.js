import React from 'react';

const HollowLink = ({text, link}) => {
	return (
		<a className="hollow-link" href={link}>{text}</a>
	)
}
export default HollowLink;