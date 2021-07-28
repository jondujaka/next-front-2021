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

	const latestEdition =
		availableEditions.length &&
		availableEditions.reduce((prev, current) => {
			return prev.year > current.year ? prev : current;
		});

	const langSlug = page.language.slug == `en` ? `` : `/sk`;

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
			<Row>
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
			<Edition
				pageContext={{
					edition: latestEdition.year,
					lang: `en`,
					translation: { language: { slug: `sk` } }
				}}
				style={{
					color: latestEdition.textColor,
					backgroundColor: latestEdition.backgroundColor
				}}
				noFooter={true}
			/>
		</Layout>
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
					playing
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
