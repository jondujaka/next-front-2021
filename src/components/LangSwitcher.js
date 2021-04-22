import React from 'react';
import {Link} from 'gatsby';

const LangSwitcher = ({item}) =>{

	console.log(item)

	let url = item.uri === `/home/` ? `/` : item.uri;

	return (
		<Link to={url}>Switch language</Link>
	)
}

export default LangSwitcher;