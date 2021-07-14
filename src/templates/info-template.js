import React from "react";
import { graphql, Link } from "gatsby";
import LangSwitcher from "../components/LangSwitcher";
import Layout from "../components/layout";
import HollowLink from "../components/hollowLink";
import Row from "../components/row";
import Paragraph from "../components/paragraph";
import ImageEl from "../components/image";
import Scrollspy from "react-scrollspy";

const Info = ({ data, pageContext }) => {
	const { settings, edition, menu } = pageContext;

	if (!data.wpContentNode) {
		return <h1>No data</h1>;
	}
	const sections = data.wpContentNode.about.section;

	let scrollSpyItems =
		sections && sections.map(section => section.title.toLowerCase());

	return (
		<Layout
			style={{
				color: settings.textColor,
				backgroundColor: settings.backgroundColor
			}}
			year={edition}
			editionHeader={menu}
		>
			<div className="row">
				<div className="col-12 d-none d-lg-block col-lg-5 col-xl-6 about-nav">
					{scrollSpyItems && (
						<Scrollspy
							items={scrollSpyItems}
							currentClassName="active"
						>
							{sections.map(section => (
								<li key={`about-${section.title}`}>
									<HollowLink
										link={`#${section.title.toLowerCase()}`}
										text={section.title}
									/>
								</li>
							))}
						</Scrollspy>
					)}
				</div>
				<div className="col-12 col-lg-7 col-xl-6 info-content">
					{sections &&
						sections.map(section => (
							<Row
								classes="mb-5 pt-4"
								id={section.title.toLowerCase()}
								key={`about-section-${section.title}`}
							>
								<h2 className="d-lg-none d-block about-title">
									{section.title}
								</h2>
								<AboutSection content={section.content} />
							</Row>
						))}
				</div>
			</div>
		</Layout>
	);
};

const AboutSection = ({ content }) => {
	return content.map((item, i) => {
		if (item.textContent) {
			return (
				<Paragraph
					key={`paragraph-about-${i}`}
					big={item.big}
					content={item.textContent}
				/>
			);
		}
		if (item.image) {
			return (
				<ImageEl
					key={`img-about-${i}`}
					srcSet={item.image.srcSet}
					caption={item.image.caption}
				/>
			);
		}
	});
};
export default Info;

export const infoQuery = graphql`
	query infoPage(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$queryType: String
	) {
		wpContentNode(
			slug: { regex: "/^info/" }
			nodeType: { regex: $queryType }
		) {
			id
			... on WpEdition2022 {
				title
			}
			... on WpEdition2021 {
				id
				title
				about {
					fieldGroupName
					section {
						content {
							... on WpEdition2021_About_section_Content_Partners {
								fieldGroupName
							}
							... on WpEdition2021_About_section_Content_Media {
								fieldGroupName
							}
							... on WpEdition2021_About_section_Content_Text {
								big
								fieldGroupName
								textContent
							}
						}
						title
					}
				}
			}
		}
	}
`;
