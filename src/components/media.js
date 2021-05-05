import React from 'react';

const Media = ({ content, classes }) => {
	console.log(content);
	if(content.images){
		return content.images.map(image => <SingleMedia classes={`column-${100 / content.images.length}`} item={image} />)
	} else {
		return <SingleMedia classes={classes} item={content.image} />
	}
	
};

const SingleMedia = ({item, classes}) => {
	return (
		<div className={`column ${classes ? classes : ``}`}>
			<figure>
				<img srcSet={item.srcSet} className="fake-media" />
				<figcaption dangerouslySetInnerHTML={{ __html: item.caption }} />
			</figure>
		</div>
	);
}

export default Media;