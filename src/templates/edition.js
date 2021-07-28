import React from "react";
import { graphql, Link } from "gatsby";
import { format } from "light-date";
import Layout from "../components/layout";
import Row from "../components/row";
import Image from "../components/image";
import Paragraph from "../components/paragraph";
import CustomLink from "../components/customLink";
import Carousel from "../components/carousel";
import ArtistsGrid from "../components/blockGrids/artistsGrid";

const Edition = ({ data, pageContext, noFooter, style }) => {
	const { edition, translation, lang, settings, content, menu, skMenu } = pageContext;

	let colorStyle;

	if (settings) {
		colorStyle = {
			color: settings.textColor,
			backgroundColor: settings.backgroundColor
		};
	} else if (style) {
		colorStyle = { ...style };
	}

	if (!content || (content && !content.topText)) {
		return <h1>Please fill in all the required fields!</h1>;
	}

	const startDate = new Date(content.topText.editionDate.startDate);
	const endDate = new Date(content.topText.editionDate.endDate);


	
	const isSk = lang !== `en`;
	const langSlug = lang ===`en` ? `sk/` : ``;
	const translationSlug = `/${langSlug}${edition}`;


	return (
		<Layout
			style={colorStyle}
			noFooter={noFooter}
			year={edition}
			isSk={isSk}
			translationSlug={translationSlug}
			editionHeader={menu}
			skMenu={skMenu}
			pageName="index"
		>
			<Row classes="edition-title">
				<h1>{content.topText.firstTilte}</h1>
				<h1>{content.topText.secondTitle}</h1>
				<h1>
					{format(startDate, "{dd}.{MM}")} -{" "}
					{format(endDate, "{dd}.{MM} {yyyy}")}
				</h1>
			</Row>

			{content.content &&
				content.content.map((section, i) => {
					if (section.fieldGroupName) {
						return (
							<Row
								classes="my-4 my-md-5"
								key={`section-edition-${i}`}
							>
								{editionRow(isSk, section, i, edition, settings)}
							</Row>
						);
					}
				})}
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
		return (
			<>
				<div className="col-12">
					<h1>{section.title}</h1>
				</div>
				<ArtistsGrid colors={colors} items={section.artists} seeAll />
				<div className="d-flex col-4 mx-auto justify-content-center align-items-center text-center mb-6">
					<div className="block-link-wrapper">
						<CustomLink
							classes="see-all-link"
							colors={colors}
							link={getLink(isSk, year, `/artists`)}
						>
							See all artists
						</CustomLink>
					</div>
				</div>
			</>
		);
	}

	if (type.endsWith(`WorkshopsSection`)) {
		return (
			<>
				<div className="col-12">
					<h1>{section.title}</h1>
				</div>
				<ArtistsGrid colors={colors} items={section.workshops} seeAll />
				<div className="d-flex col-4 mx-auto justify-content-center align-items-center text-center mb-6">
					<div className="block-link-wrapper">
						<CustomLink
							classes="see-all-link"
							colors={colors}
							link={getLink(isSk, year, `/workshops`)}
						>
							See all workshops
						</CustomLink>
					</div>
				</div>
			</>
		);
	}
};

const getLink = (isSk, year, link) => {
	if(isSk){
		return `/sk/${year}${link}`
	} else {
		return `/${year}${link}`
	}
}

export default Edition;
