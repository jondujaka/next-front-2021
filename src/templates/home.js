import React, { useEffect, useState, useRef } from "react";
import { graphql, Link } from "gatsby";
import LangSwitcher from "../components/LangSwitcher";
import Layout from "../components/layout";
import CustomLink from "../components/customLink";
import ReactPlayer from "react-player/youtube";
import Row from "../components/row";
import NewsBlock from "../components/newsBlock";
import { InView } from "react-intersection-observer";
import Edition from "./edition";

const Home = ({ data: { page, news }, pageContext }) => {
	const { availableEditions } = pageContext;

	const latestEdition =
		availableEditions.length &&
		availableEditions.reduce((prev, current) => {
			return prev.year > current.year ? prev : current;
		});

	const body = useRef(null);
	const mediaRef = useRef(null);
	const containerRef = useRef(null);

	const [showVideo, setShowVideo] = useState(false);
	const [isInView, setIsInView] = useState(true);

	const allNews = news.edges;

	const canReshowVideo = useRef(false);

	const startTimer = () => {
		window.setTimeout(() =>{
			canReshowVideo.current=true
		}, 3000);
	}

	useEffect(() => {
		setShowVideo(true);
		body.current = document.getElementsByTagName("body")[0];
		body.current.classList.add("overflow-hidden");
		window.addEventListener('scroll', handleBodyScroll)
	}, []);

	const handleBodyScroll = (e) => {
		console.log(window.scrollY);
		if(window.scrollY === 0 && canReshowVideo.current){
			setShowVideo(true);
			body.current.classList.add("overflow-hidden");
		}
	}

	const hideVideo = () => {
		setShowVideo(false);
		body.current.classList.remove('overflow-hidden');
		startTimer();
	};

	const editionContext = {
		edition: latestEdition.year,
		lang: page.language.slug,
		settings: latestEdition.content.settings,
		translation: latestEdition.content.translations[0],
		menu: latestEdition.menu,
		skMenu: latestEdition.skMenu,
		content: latestEdition.content
	};

	const langSlug = page.language.slug === `en` ? `sk/` : ``;
	const isSk = page.language.slug !== `en`;
	const translationSlug = `/${langSlug}`;

	return (
		<Layout key="layout-home" translationSlug={translationSlug} isSk={isSk}>
			{showVideo && (
				<ScrollVideo
					layer={page.mainHome.videoLayer}
					hideVideo={hideVideo}
				/>
			)}
			<Row>
				<HomeHeader
					classes="d-none d-md-block desktop col col-12"
					items={page.mainHome.topLinks}
				/>
			</Row>
			<Row classes="main-title-wrapper" fullWidth={true}>
				<h1 className="main-title">NE</h1>
				<HomeHeader
					classes="d-md-none mobile"
					items={page.mainHome.topLinks}
				/>
				<h1 className="main-title">XT</h1>
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
			<Edition pageContext={editionContext} embeded={true} />
		</Layout>
	);
};

const ScrollVideo = ({ layer, hideVideo }) => {

	const body = useRef(null);
	const mediaRef = useRef(null);

	useEffect(() => {
		const container = document.getElementById("media-container");
		body.current = document.getElementById("media-container");
		container.addEventListener("scroll", handleScroll);
	}, []);

	const handleScroll = e => {
		const threshold = mediaRef.current.offsetHeight + 200;

		console.log(threshold);
		console.log(e.target.scrollTop);

		if (e.target.scrollTop > threshold + 10) {
			body.current.classList.remove("overflow-hidden");
			hideVideo();
		}

		// console.log(mediaRef.current);
		// console.log(body.current)
		// e.preventDefault();
		// e.stopPropagation();
		console.log("asd");
		// return false;
	};

	return (
		<section
			id="media-container"
			className="media-container"
		>
			<div className="media-wrapper" ref={mediaRef}>
				<Media media={layer.media} homePage />
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
	if (media.imageOrVideo === `image`) {
		return <img srcSet={`${media.image.srcSet}`} />;
	} else {
		return (
			<ReactPlayer
				className="react-player-home"
				url={media.video}
				playing
				width="100%"
				height="100%"
			/>
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
