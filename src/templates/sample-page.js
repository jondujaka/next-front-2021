import React from "react";
import { graphql, Link } from "gatsby";

const SamplePage = ({ data: { page } }) => {
	return (
		<div>
			<h1>{page.title} ??</h1>
			<Link to={page.translations[0].uri}>Switch language</Link>
		</div>
	);
};

export default SamplePage;
