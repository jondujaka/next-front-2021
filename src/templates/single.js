import React from "react";
import Row from "../components/row";
import Media from "../components/media";
import Paragraph from "../components/paragraph";

const Single = ({ content, direct }) => {
	console.log(content);
	if (!content) {
		return ``;
	}
	if (!content.singleContent) {
		return ``;
	}
	const rows = content.singleContent.content;
	return (
		<div
			className={`single-content ${direct ? `no-padding` : `separator`}`}
		>
			{content.title && <h1 className="single-title">{content.title}</h1>}
			{rows ? (
				rows.map((item, i) => (
					<Row key={`row-${i}`} classes="my-md-4 my-lg-7">
						<DirectionWrapper content={item} direct={direct} />
					</Row>
				))
			) : (
				<h3>Nothing here yet</h3>
			)}
		</div>
	);
};

export default Single;

const DirectionWrapper = ({ content, direct }) => {
	return (
		<>
			{content.direction ? (
				<DirectionalRow row={content} />
			) : (
				<>
					{content.media ? <Media content={content.media} /> : null}
					{content.images ? <Media content={content} /> : null}
					{content.paragraph ? (
						<div
							className={`col mx-auto ${
								direct ? `` : `col-xl-10 col-12 col-xxl-6`
							}`}
						>
							<Paragraph
								big={content.paragraph.big}
								content={content.paragraph.paragraphContent}
							/>
						</div>
					) : null}
				</>
			)}
		</>
	);
};

const DirectionalRow = ({ row }) => {
	if (row.direction[0] === `media_text`) {
		return (
			<>
				{row.media && (
					<Media classes="col-xl-6 col-12" content={row.media} />
				)}
				{row.paragraph && (
					<div className="col mx-auto col-12 col-xl-6">
						<Paragraph
							big={row.paragraph.big}
							content={row.paragraph.paragraphContent}
						/>
					</div>
				)}
			</>
		);
	}
};
