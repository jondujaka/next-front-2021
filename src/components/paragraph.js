import React from 'react';

const Paragraph = ({ big, content }) => {
	console.log(big);
	return (
		<div
			className={`paragraph text-${big}`}
			dangerouslySetInnerHTML={{ __html: content }}
		/>
	);
};

export default Paragraph;
