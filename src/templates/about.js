import React from "react";
import { graphql, Link } from "gatsby";
import LangSwitcher from "../components/LangSwitcher";
import Layout from "../components/layout";
import HollowLink from "../components/hollowLink";
import Row from "../components/row";
import Paragraph from "../components/paragraph";
import ImageEl from "../components/image";
import Scrollspy from "react-scrollspy";

const About = ({ data, pageContext }) => {
	const sections = data.wpPage.about.section;
	const { latestEdition } = pageContext;

	let scrollSpyItems =
		sections && sections.map(section => section.title.toLowerCase());

	const langSlug = pageContext.lang === `en` ? `sk/` : ``;
	const isSk = pageContext.lang !== `en`;
	const translationSlug = `/${langSlug}about`;

	return (
		<Layout
			isSk={isSk}
			translationSlug={translationSlug}
			title={data.wpPage.title}
			style={latestEdition}
		>
			<div className="row">
				<div className="col col-12 mt-5 mb-6">
					<h2 className="festival-page-title">{data.wpPage.title}</h2>
				</div>
				<div className="col-12 d-none d-lg-block col-lg-5 col-xl-6 about-nav">
					{scrollSpyItems && (
						<Scrollspy
							items={scrollSpyItems}
							currentClassName="active"
						>
							{sections.map(section => {
								if (section.title === "Banner") {
									return null;
								}
								return (
									<li key={`about-${section.title}`}>
										<HollowLink
											link={`#${section.title.toLowerCase()}`}
											text={section.title}
										/>
									</li>
								);
							})}
						</Scrollspy>
					)}
				</div>
				<div className="col-12 col-lg-7 col-xl-6 about-content">
					{sections &&
						sections.map(section => (
							<div
								classes="mb-5 pt-4"
								id={section.title.toLowerCase()}
								key={`about-section-${section.title}`}
							>
								{section.title !== "Banner" && (
									<h2 className="d-md-none d-block about-title">
										{section.title}
									</h2>
								)}
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
				<figure>
					<img srcSet={item.image.srcSet} />
				</figure>
			);
		}
		if (item.fieldGroupName === `Page_About_section_Content_Partners`) {
			return (
				<div className="partners-wrapper">
					{item.partnerImages.length &&
						item.partnerImages.map(partner => (
							<Partner partner={partner} />
						))}
				</div>
			);
		}
	});
};

const Partner = ({ partner }) => {
	return (
		<div className="partner-image">
			<img width="50" srcSet={partner.srcSet} />
		</div>
	);
};

export default About;

export const aboutQuery = graphql`
	query aboutPage(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$id: String
		$lang: String
	) {
		wpPage(id: { eq: $id }, language: { slug: { eq: $lang } }) {
			about {
				section {
					title
					fieldGroupName
					content {
						... on WpPage_About_section_Content_Text {
							big
							fieldGroupName
							textContent
						}
						... on WpPage_About_section_Content_Media {
							fieldGroupName
							image {
								caption
								srcSet
							}
						}
						... on WpPage_About_section_Content_Partners {
							fieldGroupName
							partnerImages {
								srcSet
							}
						}
					}
				}
			}
			uri
			title
			translations {
				slug
				uri
			}
		}
	}
`;
