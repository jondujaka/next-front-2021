import React, { useEffect, useState, useRef } from "react";
import { graphql, Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image"
import LangSwitcher from "../components/LangSwitcher";
import Layout from "../components/layout";
import CustomLink from "../components/customLink";
import ReactPlayer from "react-player/youtube";
import Row from "../components/row";
import NewsBlock from "../components/newsBlock";
import { InView } from "react-intersection-observer";
import Edition from "./edition";
import throttle from "lodash.throttle";

import TextTopMob from '../images/optimized/letters-top-mobile.svg';
import TextBotMob from '../images/optimized/letters-bottom-mobile.svg';
import TextTopDesktop from '../images/optimized/letters-top-desktop.svg';
import TextBotDesktop from '../images/optimized/letters-bottom-desktop.svg';


const Home = ({ data: { page, news }, pageContext, location }) => {
	const { latestEdition } = pageContext;

	const allNews = news.edges;

	const editionContext = latestEdition
		? {
				edition: latestEdition.year,
				lang: page.language.slug,
				settings: latestEdition.content.settings,
				translation: latestEdition.content.translations[0],
				menu: latestEdition.menu,
				skMenu: latestEdition.skMenu,
				content: latestEdition.content
		  }
		: null;

	const langSlug = page.language.slug === `en` ? `sk/` : ``;
	const isSk = page.language.slug !== `en`;
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
			

			<Row classes="main-title-wrapper mt-6" fullWidth={true}>
				{/* <TextTopMob /> */}
				<img className="d-none d-lg-block" src={TextTopDesktop} alt="NEXT" />
				<img className="d-block d-lg-none" src={TextTopMob} alt="NEXT" />
				
				<ScrollVideo
					layer={page.mainHome.videoLayer}
				/>
				<img className="d-none d-lg-block" src={TextBotDesktop} alt="NEXT" />
				<img className="d-block d-lg-none" src={TextBotMob} alt="NEXT" />
				{/* <img className="d-none d-lg-block" src="../images/optimized/letters-bottom-desktop.svg" alt="NEXT" /> */}
				{/* <img className="d-block d-lg-none" src="../images/optimized/letters-bottom-mobile.svg" alt="NEXT" /> */}
			</Row>

			{/* <Row>
				{page.translations.length ? (
					<Link to={langSlug}>Switch language - {isInView.toString()}</Link>
				) : null}
			</Row> */}

			<br />
			<Row classes="mb-6">
				<h1 className="col col-12">News</h1>
				{allNews.map(newsItem => (
					<NewsBlock
						key={`news-${newsItem.node.id}`}
						item={newsItem.node}
					/>
				))}
				<div className="col col-12 text-center mt-5">
					<Link className="big-button" to={`${langSlug}/news`}>
						See all News
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

const ScrollVideo = ({ layer, show }) => {
	return (
		<section id="media-container" className={`media-container`}>
			<div className="media-wrapper">
				{layer.title ? (
					<div className="top-video-title">{layer.title}</div>
				) : (
					``
				)}
				<Media media={layer.media} homePage />
				{layer.button && layer.button.title ? (
					<Link to={layer.button.url} className="top-video-link">
						{layer.button.title} ⟶
					</Link>
				) : (
					``
				)}
			</div>
		</section>
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

const Media = ({ media, setIsInView }) => {
	const [videoOverlay, setVideoOverlay] = useState(true);

	const initVideoOverlay = () => {
		window.setTimeout(() => {
			if (playerRef.current) {
				playerRef.current.wrapper.classList.remove("has-overlay");
			}
		}, 2500);
	};

	const playerRef = useRef();
	if (media.imageOrVideo === `image`) {
		return <img srcSet={`${media.image.srcSet}`} />;
	} else {
		return (
			<>
				<ReactPlayer
					className={`react-player-home ${
						videoOverlay ? `has-overlay` : ``
					}`}
					url={media.video}
					playing={true}
					ref={playerRef}
					onReady={initVideoOverlay}
					loop
					muted
					playsinline
					controls={false}
					width="100%"
					height="100%"
					progressInterval={100}
					onProgress={progress => {
						if (progress.played >= 0.99) {
							playerRef.current.seekTo(0);
						}
					}}
				/>
			</>
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
			limit: 6
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
