import React from "react";
import { Query } from "react-apollo";
import queryString from "query-string";

const withPreview = (args = { preview: false }, props) => Component => {


	const preview = props => {

		let preview=false;

		if (!preview) {
			return <Component preview={false} {...props} />;
		}

return ``;
	};

	// console.log(props.location)

	// const parsed = queryString.parse(props.location.search);
	// const { nonce, preview, post } = parsed;

	// Id needs to be an int for preview query.
	// const id = parseInt(post, 10);

	/**
	 * If no preview param, return the component with the preview props as false.
	 */
	

	

	/**
	 * Otherwise, run our Apollo query.
	 */
	

	return preview;
};

export default withPreview;
