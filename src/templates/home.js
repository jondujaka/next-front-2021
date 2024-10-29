import React, { useEffect, useState, useRef } from "react";
import { graphql, Link, navigate } from "gatsby";
import Layout from "../components/layout";
import ReactPlayer from "react-player/youtube";
import Row from "../components/row";
import NewsBlock from "../components/newsBlock";
import Edition from "./edition";
import videoWebm from "../videos/next-web-encoded.webm";
import videoMp4 from "../videos/next-web-encoded.mp4";

const Home = ({ data: { page, news }, pageContext, location }) => {
	const { latestEdition } = pageContext;

	const allNews = news.edges;
	const isSk = page.language.slug !== `en`;

	useEffect(() => {
		if (page.mainHome.redirectToEditionPage) {
			if (latestEdition) {
				if (isSk) {
					navigate(latestEdition.skContent.uri);
					return;
				}
				navigate(latestEdition.content.uri);
			}
		}
	}, []);

	if (page.mainHome.redirectToEditionPage) {
		return null;
	}

	const editionContext = latestEdition
		? {
				edition: latestEdition.year,
				lang: page.language.slug,
				settings: latestEdition.content.settings,
				translation: latestEdition.content.translations[0],
				menu: latestEdition.menu,
				skMenu: latestEdition.skMenu,
				content: isSk ? latestEdition.skContent : latestEdition.content
			}
		: null;

	const langSlug = page.language.slug === `en` ? `sk` : ``;
	const translationSlug = `/${langSlug}`;

	const editionBorder = {
		borderTop: `3px solid ${editionContext.settings.textColor}`
	};

	return (
		<Layout
			key="layout-home"
			translationSlug={translationSlug}
			isSk={isSk}
			style={editionContext.settings}
		>
			<Row classes="main-title-wrapper" fullWidth={true}>
				<ScrollVideo
					layer={page.mainHome.videoLayer}
					link={page.mainHome.videoLayer?.button?.url}
				/>
				{page.mainHome.videoLayer.button &&
				page.mainHome.videoLayer.button.title ? (
					<Link
						to={page.mainHome.videoLayer.button.url}
						className="top-video-link"
					>
						{page.mainHome.videoLayer.button.title} &rarr;
					</Link>
				) : (
					``
				)}
			</Row>

			<br />
			<Row classes="mb-6">
				<h1 className="col col-12">{isSk ? `Novinky` : `News		`}</h1>
				{allNews.map(newsItem => (
					<NewsBlock
						key={`news-${newsItem.node.id}`}
						item={newsItem.node}
					/>
				))}
				<div className="col col-12 text-center mt-5">
					<Link
						className="big-button"
						to={`${isSk ? `/sk` : ``}/news`}
					>
						{isSk ? `Viac noviniek` : `See all News`}
					</Link>
				</div>
			</Row>
			{latestEdition && (
				<div style={editionBorder} className="home-edition-wrapper">
					<Edition pageContext={editionContext} embeded={true} />
				</div>
			)}
		</Layout>
	);
};

const ScrollVideo = ({ layer, show, link }) => {
	return (
		<Link to={link || ""}>
			<section id="media-container" className={`media-container`}>
				<div className="media-wrapper">
					<Media media={layer.media} homePage />
				</div>
			</section>
		</Link>
	);
};

const HomeHeader = ({ items, classes }) => {
	return (
		<div className={`top-header ${classes}`}>
			{items.map(item => {
				if (item.item.link && item.item.link.url) {
					return (
						<Link
							key={`link-${item.item.link.url}`}
							to={item.item.link.url}
						>
							{item.item.text} ⟶
						</Link>
					);
				}
				return (
					<a href="google.com" key={`text-${item.item.text}`}>
						{item.item.text}
					</a>
				);
			})}
		</div>
	);
};

const Media = ({ media }) => {
	if (media.imageOrVideo === `image`) {
		return <img srcSet={`${media.image.srcSet}`} />;
	} else {
		return (
			<video
				className="home-video"
				loop
				autoPlay="true"
				muted="true"
				playsInline="true"
			>
				<source src={media.video} type="video/mp4" />
				{/* <source src={videoWebm} type="video/webm" /> */}
			</video>
		);
	}
};

export default Home;

export const pageQuery = graphql`
	query Homepage(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$id: String!
		$lang: String!
	) {
		# selecting the current page by id
		page: wpPage(id: { eq: $id }, language: { slug: { eq: $lang } }) {
			id
			title
			language {
				slug
			}
			translations {
				uri
				slug
			}
			mainHome {
				redirectToEditionPage
				topLinks {
					item {
						link {
							url
						}
						text
					}
				}
				videoLayer {
					button {
						title
						url
					}
					title
					media {
						imageOrVideo
						video
						image {
							srcSet
						}
					}
				}
			}
		}

		news: allWpNewsArticle(
			filter: { language: { slug: { eq: $lang } } }
			limit: 4
			sort: { order: DESC, fields: date }
		) {
			edges {
				node {
					date(formatString: "MMM Do YYYY")
					id
					slug
					uri
					title
					language {
						slug
					}
					featuredImage {
						node {
							srcSet
						}
					}
				}
			}
		}
	}
`;
