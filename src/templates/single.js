import React from "react";
import Row from "../components/row";
import Media from '../components/media';

const Single = ({ content }) => {
	const rows = content.singlePostContent.content;
	console.log(content);
	return (
		<div className="single-content">
			<h1 className="single-title">{content.title}</h1>
			{rows &&
				rows.map(item => (
					<Row>
						<DirectionWrapper content={item} />
					</Row>
				))}
		</div>
	);
};

export default Single;

const DirectionWrapper = ({ content }) => {
	console.log(content);
	return (
		<>
			{content.direction ? (
				<DirectionalRow row={content} />
			) : (
				<>
					{content.media ? (
						<Media content={content.media} />
					) : null}
					{content.images ? (
						<Media content={content} />
					) : null}
					{content.paragraph ? (
						<div className="column column-50">
							<Paragraph content={content.paragraph} />
						</div>
					) : null}
				</>
			)}
		</>
	);
};

const DirectionalRow = ({ row }) => {
	if (row.direction === `media_text`) {
		console.log(row);
		return (
			<>
				{row.media && (
					<Media classes="column-50" content={row.media} />
				)}
				{row.paragraph && (
					<div className="column column-50">
						<Paragraph content={row.paragraph} />
					</div>
				)}
			</>
		);
	}
};

const Paragraph = ({ content }) => (
	<div
		className={`paragraph text-${content.big}`}
		dangerouslySetInnerHTML={{ __html: content.paragraphContent }}
	/>
);
