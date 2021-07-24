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

	if(!content || (content && !content.topText)){
		return <h1>Please fill in all the required fields!</h1>
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
					if (section.fieldGroupName) {
						return (
							<Row classes="my-4 my-md-5" key={`section-edition-${i}`}>
								{editionRow(section, i, edition, settings)}
							</Row>
						);
					}
				})
			}
		</Layout>
	);
};

const editionRow = (section, i, year, colors) => {
	const type = section.fieldGroupName;
	if (type.endsWith(`Media`)) {
		
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
					<CustomLink colors={colors} classes="see-all-link" link={section.link.url} key={`${type}-${i}`}>
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
				<ArtistsGrid colors={colors} items={section.artists}  seeAll />
				<div className="d-flex col-4 mx-auto justify-content-center align-items-center text-center mb-6">
					<div className="block-link-wrapper">
						<CustomLink classes="see-all-link" colors={colors} link={`/${year}/artists`}>
							See all artists
						</CustomLink>
					</div>
				</div>
			</>
		);
	}
};

export default Edition;
