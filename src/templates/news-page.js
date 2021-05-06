import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import NewsBlock from "../components/newsBlock";

const Events = ({ data, pageContext }) => {
	const news = data.news.edges;
	return (
		<Layout>
			<Row>
				<div className="column column-100">
					<h2>News</h2>
				</div>
				{news.map(newsItem => (
					<NewsBlock key={`news-${newsItem.node.id}`} item={newsItem.node} />
				))}
				{news.map(newsItem => (
					<NewsBlock key={`news1-${newsItem.node.id}`} item={newsItem.node} />
				))}
				{news.map(newsItem => (
					<NewsBlock key={`news3-${newsItem.node.id}`} item={newsItem.node} />
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
