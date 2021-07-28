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
	const { settings, edition, menu, lang, skMenu } = pageContext;

	// if (!data.wpContentNode) {
	// 	return <h1>No data</h1>;
	// }
	const infoPages = data.allWpContentNode.edges;
	const isSk = lang !== `en`;
	const langSlug = lang === `en` ? `sk/` : ``;
	const translationSlug = `/${langSlug}${edition}/info`;

	console.log(lang);
	console.log(infoPages);

	const translatedContent = infoPages.find(page => page.node.language.slug === lang);

	console.log(translatedContent)

	const sections = translatedContent.node.about.section;

	console.log(sections)

	let scrollSpyItems =
		sections && sections.map(section => section.title.toLowerCase());
	return (
		<Layout
			style={{
				color: settings.textColor,
				backgroundColor: settings.backgroundColor
			}}
			isSk={isSk}
			translationSlug={translationSlug}
			year={edition}
			editionHeader={menu}
			skMenu={skMenu}
			pageName="Info"
		>
			<div className="row">
				<div className="col col-12 d-none d-md-block col-md-4 d-md-block col-xl-6 about-nav">
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
				<div className="col col-12 col-md-8 col-xl-6 info-content mt-5">
					{sections &&
						sections.map(section => (
							<div
								className="mb-5"
								id={section.title.toLowerCase()}
								key={`about-section-${section.title}`}
							>
								<h2 className="d-md-none d-block about-title">
									{section.title}
								</h2>
								<AboutSection content={section.content} />
							</div>
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
		allWpContentNode(
			filter: {
				slug: { regex: "/^info/" }
				nodeType: { regex: $queryType }
			}
		) {
			edges {
				node {
					id
					... on WpEdition2022 {
						title
					}
					... on WpEdition2021 {
						id
						title
						language {
							slug
						}
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
		}
	}
`;
