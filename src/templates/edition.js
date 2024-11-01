import React from "react";
import { graphql, Link } from "gatsby";
import { format, localeFormat } from "light-date";
import Layout from "../components/layout";
import Row from "../components/row";
import Image from "../components/image";
import Paragraph from "../components/paragraph";
import CustomLink from "../components/customLink";
import Carousel from "../components/carousel";
import ArtistsGrid from "../components/blockGrids/artistsGrid";
import videoWebm from "../videos/next-edition-2021.webm";
import videoMp4 from "../videos/next-edition-2021.mp4";

const Edition = ({ data, pageContext, embeded, style }) => {
	const {
		edition,
		year,
		translation,
		lang,
		settings,
		content,
		menu,
		skMenu
	} = pageContext;

	let colorStyle;

	if (settings) {
		colorStyle = {
			textColor: settings.textColor,
			color: settings.textColor,
			backgroundColor: settings.backgroundColor,
			borderColor: settings.textColor
		};
	} else if (style) {
		colorStyle = { ...style };
	}

	// if (!content || (content && !content.topText)) {
	// 	return <h1>Please fill in all the required fields!</h1>;
	// }

	const parsedContent = content.editionContent
		? content.editionContent
		: content;

	const startDate = new Date(parsedContent.topText.editionDate.startDate);
	const endDate = new Date(parsedContent.topText.editionDate.endDate);

	const isSk = lang !== `en`;
	const langSlug = lang === `en` ? `sk/` : ``;
	const translationSlug = `/${langSlug}${edition}`;

	const getDate = () => {
		const startMonth = format(startDate, "{MM}");
		const endMonth = format(endDate, "{MM}");

		let parsedStartDate;
		if (startMonth === endMonth) {
			parsedStartDate = format(startDate, "{dd}");
		} else {
			parsedStartDate = format(
				startDate,
				`{dd} ${localeFormat(startDate, "{MMM}")}`
			);
		}

		const parsedEndDate = format(
			endDate,
			`{dd} ${localeFormat(endDate, "{MMM}")} {yyyy}`
		);

		return `${parsedStartDate}–${parsedEndDate}`;
	};

	return (
		<Layout
			key="layout-edition"
			style={colorStyle}
			embeded={embeded}
			year={edition || year}
			isSk={isSk}
			translationSlug={translationSlug}
			editionHeader={menu}
			skMenu={skMenu}
			pageName="index"
		>
			<Row classes="edition-title">
				<h1>{parsedContent.topText.firstTilte}</h1>
				<h1>{parsedContent.topText.secondTitle}</h1>
				<h1>{getDate()}</h1>
			</Row>

			{parsedContent.content &&
				parsedContent.content.map((section, i) => {
					if (section.fieldGroupName) {
						return (
							<Row
								classes="my-4 my-md-5"
								key={`section-edition-${i}`}
							>
								{editionRow(
									isSk,
									section,
									i,
									edition,
									settings
								)}
							</Row>
						);
					}
				})}

			{parsedContent.video?.mp4Format?.mediaItemUrl && (
				<Row classes="my-4 my-md-5">
					<div className="col col-12">
						<video
							className="home-video"
							loop
							autoPlay="true"
							muted="true"
							playsInline="true"
							poster={
								parsedContent.video.poster?.mediaItemUrl || ""
							}
						>
							<source
								src={parsedContent.video.mp4Format.mediaItemUrl}
								type="video/mp4"
							/>
							{parsedContent.video.webmFormat?.mediaItemUrl && (
								<source
									src={
										parsedContent.video.webmFormat
											.mediaItemUrl
									}
									type="video/webm"
								/>
							)}
						</video>
					</div>
				</Row>
			)}
		</Layout>
	);
};

const editionRow = (isSk, section, i, year, colors) => {
	const type = section.fieldGroupName;
	if (type.endsWith(`Media`)) {
		return section.images.length > 1 ? (
			<div className="col-12 px-md-4 px-lg-8">
				<Carousel key={`${type}-${i}`} items={section.images} />
			</div>
		) : (
			<div className="col-12 px-md-3 px-lg-8">
				<Image key={`${type}-${i}`} srcSet={section.images[0].srcSet} />
			</div>
		);
	}
	if (type.endsWith(`Title`)) {
		return (
			<div className="col-12">
				<h1 className="edition-content-title" key={`${type}-${i}`}>
					{section.text}
				</h1>
			</div>
		);
	}
	if (type.endsWith(`Paragraph`)) {
		return (
			<div className="col col-12 col-md-10 col-lg-8 col-xl-6 mx-auto">
				<Paragraph key={`${type}-${i}`} content={section.text} big />
			</div>
		);
	}
	if (type.endsWith(`Link`)) {
		return (
			<div className="col-12 text-center mb-6">
				<div className="block-link-wrapper">
					<CustomLink
						colors={colors}
						classes="see-all-link"
						link={section.link.url}
						key={`${type}-${i}`}
					>
						{section.link.title}
					</CustomLink>
				</div>
			</div>
		);
	}

	if (type.endsWith(`ArtistsSection`)) {
		if (section.artists && section.artists.length) {
			let parsedArtists = isSk
				? section.artists.map(artist => {
						if (artist.language.slug === `en` && isSk) {
							return {
								...artist,
								uri: artist.translations[0].uri,
								title: artist.translations[0].title
							};
						}
						return artist;
					})
				: section.artists;

			return (
				<>
					<div className="col-12">
						<h1>{isSk ? `Umelci` : `Artists`}</h1>
					</div>
					<ArtistsGrid colors={colors} items={parsedArtists} seeAll />
					<div className="d-flex col-4 mx-auto justify-content-center align-items-center text-center mb-6">
						<div className="block-link-wrapper">
							<CustomLink
								classes="see-all-link"
								colors={colors}
								link={getLink(isSk, year, `/artists`)}
							>
								{isSk ? `Všetci umelci` : `See all artists`}
							</CustomLink>
						</div>
					</div>
				</>
			);
		}

		return ``;
	}

	if (type.endsWith(`WorkshopsSection`)) {
		if (section.workshops && section.workshops.length) {
			let parsedWorkshops = isSk
				? section.workshops.map(workshop => {
						if (workshop.language.slug === `en` && isSk) {
							return {
								...workshop,
								uri: workshop.translations[0].uri,
								title: workshop.translations[0].title
							};
						}
						return workshop;
					})
				: section.workshops;

			return (
				<>
					<div className="col-12">
						<h1>{section.title}</h1>
					</div>
					<ArtistsGrid
						colors={colors}
						items={parsedWorkshops}
						seeAll
					/>
					<div className="d-flex col-4 mx-auto justify-content-center align-items-center text-center mb-6">
						<div className="block-link-wrapper">
							<CustomLink
								classes="see-all-link"
								colors={colors}
								link={getLink(isSk, year, `/workshops`)}
							>
								{isSk
									? `Všetky workshopy`
									: `See all workshops`}
							</CustomLink>
						</div>
					</div>
				</>
			);
		}
		return null;
	}
};

const getLink = (isSk, year, link) => {
	if (isSk) {
		return `/sk/${year}${link}`;
	} else {
		return `/${year}${link}`;
	}
};

export default Edition;
