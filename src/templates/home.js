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
	const { translations, language, mainHome } = { page };
	const { availableEditions } = pageContext;

	const langSlug = page.language.slug == `en` ? `/` : `/s`;

	const allNews = news.edges;

	const [isInView, setIsInView] = useState(true);

	return (
		<Layout>
			{isInView && (
				<section className="media-container no-scrollbar">
					<div className="media-wrapper">
						<Media
							setIsInView={setIsInView}
							media={page.mainHome.videoLayer.media}
						/>
					</div>
				</section>
			)}
			<Row>
				<HomeHeader items={page.mainHome.topLinks} />
			</Row>
			<Row fullWidth={true}>
				<h1 className="main-title">NEXT</h1>
			</Row>

			{/* <Row>
				{page.translations.length ? (
					<Link to={langSlug}>Switch language - {isInView.toString()}</Link>
				) : null}
			</Row> */}

			<br />
			<Row>
				<h2 className="col col-12">News</h2>
				{allNews.map(newsItem => (
					<NewsBlock key={`news-${newsItem.node.id}`} item={newsItem.node} />
				))}
				{allNews.map(newsItem => (
					<NewsBlock key={`news1-${newsItem.node.id}`} item={newsItem.node} />
				))}
				{allNews.map(newsItem => (
					<NewsBlock key={`news3-${newsItem.node.id}`} item={newsItem.node} />
				))}
				<div className="col col-12 text-center mt-5">
					<Link className="big-button" to={`${langSlug}/news`}>See all News</Link>
				</div>
			</Row>
			<Edition
				pageContext={{
					edition: `2021`,
					lang: `en`,
					translation: { language: { slug: `sk` } }
				}}
			/>
		</Layout>
	);
};

const HomeHeader = ({ items }) => {
	return items.map(item => {
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

		news: allWpNewsArticle(
			filter: { language: { slug: { eq: $lang } } }
			limit: 10
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
							sizes
							uri
							description
							caption
							mediaDetails {
								sizes {
									name
									sourceUrl
								}
							}
						}
					}
				}
			}
		}
	}
`;
