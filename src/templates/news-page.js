import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import NewsBlock from "../components/newsBlock";

const Events = ({ data, pageContext }) => {
	const news = data.news.edges;

	const langSlug = pageContext.lang ===`en` ? `sk/` : ``;
	const isSk = pageContext.lang !== `en`;
	const translationSlug = `/${langSlug}news`;

	return (
		<Layout translationSlug={translationSlug} isSk={isSk}>
			<Row>
				<div className="col col-12 mt-5 mb-6">
					<h2 className="festival-page-title">{pageContext.title}</h2>
				</div>
				{news.map(newsItem => (
					<NewsBlock key={`news-${newsItem.node.id}`} item={newsItem.node} />
				))}
			</Row>
		</Layout>
	);
};

export default Events;

export const eventQuery = graphql`
	query allNews(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$lang: String!
	) {
		news: allWpNewsArticle(
			filter: { language: { slug: { eq: $lang } } }
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
