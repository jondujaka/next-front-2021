import React from "react";
import { Query } from "react-apollo";
import queryString from "query-string";

const withPreview = (args = { preview: false }, props) => Component => {

	console.log('IN HERE AT LEAST');
	console.log(args);

	const preview = props => {

		let preview=false;

		if (!preview) {
			return <Component preview={false} {...props} />;
		}

		return (
			<Query
			query={args.preview}
			variables={{
			  postid: `454`,
			  'wp_token': `72b626b874` ,
			}}
			>
				{({ data, loading, error }) => {
					
				  if (loading) return <p>Loading preview...</p>;
				  if (error) return <p>Error: ${error.message}</p>;
	  
				  return (
					<h2>Test</h2>
				  )
				}}
			</Query>
		  )
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
