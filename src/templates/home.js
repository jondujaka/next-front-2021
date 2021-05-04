import React, { useEffect, useState, useRef } from "react";
import { graphql, Link } from "gatsby";
import LangSwitcher from "../components/LangSwitcher";
import Layout from "../components/layout";
import CustomLink from "../components/customLink";
import ReactPlayer from "react-player/youtube";
import Row from "../components/row";
import { InView } from "react-intersection-observer";
import Edition from './edition';

const Home = ({ data: { page, news }, pageContext }) => {
	const { translations, language, mainHome } = { page };
	const { availableEditions } = pageContext;
	console.log(news);

	const langSlug = page.language.slug == `en` ? `/sk` : `/`;

	const allNews = news.edges;

	const [isInView, setIsInView] = useState(true);


	// const homeVideoRef = useRef(null);

	// useEffect(() => {
	// 	homeVideoRef.current.addEventListener('scroll', (ev) => {
	// 		console.log(ev.target);
	// 	})
	// });

	return (
		<Layout>
			{isInView && (
				<section className="media-container">
					<div className="media-wrapper">
						<Media setIsInView={setIsInView} media={page.mainHome.videoLayer.media} />
					</div>
				</section>
			)}
			<Row>
				<HomeHeader items={page.mainHome.topLinks} />
			</Row>
			<Row fullWidth={true}>
				<h1 className="main-title">NEXT</h1>
			</Row>

			<Row>
				{page.translations.length ? (
					<Link to={langSlug}>Switch language - {isInView.toString()}</Link>
				) : null}
			</Row>

			<br />
			<Row>
				<h2 className="column column-100">News</h2>
				{allNews.map(newsItem => {
					console.log(newsItem);
					return (
						<div
							key={newsItem.node.id}
							className="news-item column column-50"
						>
							<div className="fake-news-image"></div>
							<div className="news-info">
								<h3>Mar 17th 2021</h3>
								<h3>{newsItem.node.title}</h3>
							</div>
						</div>
					);
				})}
				{allNews.map(newsItem => {
					console.log(newsItem);
					return (
						<div
							key={`a-${newsItem.node.id}`}
							className="news-item column column-50"
						>
							<div className="fake-news-image"></div>
							<div className="news-info">
								<h3>Mar 17th 2021</h3>
								<h3>{newsItem.node.title}</h3>
							</div>
						</div>
					);
				})}
				{allNews.map(newsItem => {
					console.log(newsItem);
					return (
						<div
							key={`b-${newsItem.node.id}`}
							className="news-item column column-50"
						>
							<div className="fake-news-image"></div>
							<div className="news-info">
								<h3>Mar 17th 2021</h3>
								<h3>{newsItem.node.title}</h3>
							</div>
						</div>
					);
				})}
				{allNews.map(newsItem => {
					console.log(newsItem);
					return (
						<div
							key={`a-${newsItem.node.id}`}
							className="news-item column column-50"
						>
							<div className="fake-news-image"></div>
							<div className="news-info">
								<h3>Mar 17th 2021</h3>
								<h3>{newsItem.node.title}</h3>
							</div>
						</div>
					);
				})}
			</Row>
			<Edition pageContext={{edition: `2021`, lang: `en`, translation: { language: { slug: `sk`}}}}/>
		</Layout>
	);
};

const HomeHeader = ({ items }) => {
	return items.map(item => {
		console.log(item);
		if (item.item.link && item.item.link.url) {
			return (
				<CustomLink
					key={`link-${item.item.link.url}`}
					link={item.item.link.url}
				>
					{item.item.text}
				</CustomLink>
			);
		}
		return <span key={`text-${item.item.text}`}>{item.item.text}</span>;
	});
};

const Media = ({ media, setIsInView }) => {
	if (media.imageOrVideo === `image`) {
		return <img srcSet={`${media.image.srcSet}`} />;
	} else {
		return (
			<InView
				as="div"
				className="player-wrapper"
				onChange={(inView, entry) => setIsInView(inView)}
			>
				<ReactPlayer
					className="react-player"
					url={media.video}
					width="100%"
					height="100%"
				/>
			</InView>
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
		page: wpPage(id: { eq: $id }) {
			id
			content
			title
			language {
				slug
			}
			translations {
				uri
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

		news: allWpNewsArticle(filter: { language: { slug: { eq: $lang } } }) {
			edges {
				node {
					id
					slug
					uri
					title
					language {
						slug
					}
				}
			}
		}
	}
`;
