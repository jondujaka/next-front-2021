import React from "react";
import Row from "../components/row";
import Media from '../components/media';

const Single = ({ content }) => {
	const rows = content.singlePostContent.content;
	return (
		<div className="single-content">
			<h1 className="single-title">{content.title}</h1>
			{rows &&
				rows.map(item => (
					<Row classes="my-md-4 my-lg-7">
						<DirectionWrapper content={item} />
					</Row>
				))}
		</div>
	);
};

export default Single;

const DirectionWrapper = ({ content }) => {
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
						<div className="col mx-auto col-xl-10 col-12 col-xxl-6">
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
		return (
			<>
				{row.media && (
					<Media classes="col-xl-6 col-12" content={row.media} />
				)}
				{row.paragraph && (
					<div className="col mx-auto col-12 col-xl-6">
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
