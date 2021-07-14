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
	const { edition, translation, lang, settings, content, menu } = pageContext;

	let colorStyle;

	if (settings) {
		colorStyle = {
			color: settings.textColor,
			backgroundColor: settings.backgroundColor
		};
	} else if (style) {
		colorStyle = { ...style };
	}

	const startDate = new Date(content.topText.editionDate.startDate);
	const endDate = new Date(content.topText.editionDate.endDate);

	return (
		<Layout
			style={colorStyle}
			noFooter={noFooter}
			year={edition}
			editionHeader={menu}
		>
			<Row classes="edition-title">
				<div className="col-12">
					<h1>{content.topText.firstTilte}</h1>
				</div>
				<div className="col-12">
					<h1>{content.topText.secondTitle}</h1>
				</div>
				<div className="col-12">
					<h1>
						{format(startDate, "{dd}.{MM}")} -{" "}
						{format(endDate, "{dd}.{MM} {yyyy}")}
					</h1>
				</div>
			</Row>

			{content.content &&
				content.content.map((section, i) => {
					return (
						<Row classes="my-6" key={`section-edition-${i}`}>
							{editionRow(section, i)}
						</Row>
					);
				})}
		</Layout>
	);
};

const editionRow = (section, i) => {
	const type = section.fieldGroupName;
	if (type.endsWith(`Media`)) {
		console.log(section.images);
		return section.images.length > 1 ? (
			<div className="col-12">
				<Carousel key={`${type}-${i}`} items={section.images} />
			</div>
		) : (
			<div className="col-12 px-8">
				<Image key={`${type}-${i}`} srcSet={section.images[0].srcSet} />
			</div>
		);
	}
	if (type.endsWith(`Title`)) {
		return (
			<div className="col-12">
				<h1 className="edition-content-title" key={`${type}-${i}`}>{section.text}</h1>
			</div>
		);
	}
	if (type.endsWith(`Paragraph`)) {
		return (
			<div className="col-6 mx-auto">
				<Paragraph key={`${type}-${i}`} content={section.text} big />
			</div>
		);
	}
	if (type.endsWith(`Link`)) {
		return (
			<div className="col-12 text-center">
				<CustomLink link={section.link.url} key={`${type}-${i}`}>
					{section.link.title}
				</CustomLink>
			</div>
		);
	}

	if (type.endsWith(`ArtistsSection`)) {
		return (
			<>
				<div className="col-12">
					<h1>{section.title}</h1>
				</div>
				<ArtistsGrid items={section.artists} seeAll />
				<div className="col-12 text-center">
					<CustomLink link="/artists">See all artists</CustomLink>
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
				<ArtistsGrid items={section.workshops} seeAll />
				<div className="col-12 text-center">
					<CustomLink link="/workshops">See all workshops</CustomLink>
				</div>
			</>
		);
	}
};

export default Edition;
