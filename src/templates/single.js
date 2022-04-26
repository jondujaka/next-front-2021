import React from "react";
import Row from "../components/row";
import Media from "../components/media";
import Video from "../components/video";
import Paragraph from "../components/paragraph";

const Single = ({ content, direct, noTitle, ...props }) => {
	if (!content) {
		return ``;
	}
	if (!content.singleContent) {
		return ``;
	}
	const rows = content.singleContent
		? content.singleContent.content
		: content.singlePostContent.content;

	return (
		<div
			className={`single-content ${direct ? `no-padding` : `separator`}`}
			{...props}
		>
			{!noTitle && <Row>
				<div className="col-12">
					{content.title && (
						<h1 className="single-title">{content.title}</h1>
					)}
				</div>
			</Row>}
			{rows ? (
				rows.map((item, i) => (
					<Row key={`row-${i}`} classes="my-md-4 my-5 my-lg-7">
						<DirectionWrapper content={item} direct={direct} />
					</Row>
				))
			) : (
				<Row classes="my-md-4 my-5 my-lg-7">
					<div className="col-12">
						<h3>Coming soon...</h3>
					</div>
				</Row>
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
					{content.video ? (
						<div className="col mx-auto col-lg-6 col-12">
							<Video url={content.video} />
						</div>
					) : null}
					{content.images ? <Media content={content} /> : null}
					{content.paragraph ? (
						<div
							className={`col mx-auto ${
								direct ? `` : `col-lg-6 col-12`
							}`}
						>
							<Paragraph
								big={content.paragraph.big}
								content={content.paragraph.paragraphContent}
							/>
						</div>
					) : null}

					{content.paragraphContent ? (
						<div
							className={`col mx-auto ${
								direct ? `` : `col-lg-6 col-12`
							}`}
						>
							<Paragraph
								big={content.big}
								content={content.paragraphContent}
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
					<Media classes="col-lg-6 col-12 mb-5" content={row.media} />
				)}
				{row.paragraph && (
					<div className="col mx-auto col-12 col-lg-6">
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
