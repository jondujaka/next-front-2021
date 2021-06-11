import React from 'react';

const Paragraph = ({ big, content }) => {

	return (
		<div
			className={`paragraph text-${big}`}
			dangerouslySetInnerHTML={{ __html: content }}
		/>
	);
};

export default Paragraph;
