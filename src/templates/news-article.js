import React from "react";
import { graphql, Link } from "gatsby";
import LangSwitcher from "../components/LangSwitcher";
import Layout from "../components/layout";
import NewsBlock from "../components/newsBlock";
import Row from "../components/row";
import Single from "./single";

const NewsArticle = ({ data: { article }, pageContext }) => {
	const translationSlug = article.translations[0]?.uri;
	const { latestEdition } = pageContext;
	const isSk = article.language.slug === `sk`;
	return (
		<Layout
			isSk={isSk}
			translationSlug={translationSlug}
			style={latestEdition}
		>
			<Row>
				<div className="col col-12 mt-5 mb-6">
					<h2 className="festival-page-title">
						<Link
							className="inherit"
							to={`${isSk ? `/sk` : ``}/news`}
						>
							{isSk ? `Správy` : `News`}
						</Link>
						{` > ${article.title}`}
					</h2>
				</div>
			</Row>
			<Single content={article} />
			<MoreNews items={pageContext.related} isSk={isSk} />
		</Layout>
	);
};

const MoreNews = ({ items, isSk }) => {
	return (
		<div className="related-news">
			<div className="row">
				<div className="col-12 mb-4">
					<h1>{isSk ? `Viac noviniek` : `More News`}</h1>
				</div>
				{items.length &&
					items.map(item => {
						console.log(item);
						return (
							<NewsBlock
								key={`news-${item.article.id}`}
								item={item.article}
							/>
						);
					})}
			</div>
		</div>
	);
};
export default NewsArticle;

export const eventQuery = graphql`
	query articleById(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$id: String!
	) {
		# selecting the current post by id
		article: wpNewsArticle(id: { eq: $id }) {
			title
			language {
				slug
			}
			translations {
				slug
				uri
			}
			singleContent {
				content {
					... on WpNewsArticle_Singlecontent_Content_MediaText {
						fieldGroupName
						direction
						paragraph {
							big
							fieldGroupName
							paragraphContent
						}
						media {
							image {
								srcSet
								caption
							}
							fieldGroupName
							video
							imageOrVideo
						}
					}
					... on WpNewsArticle_Singlecontent_Content_Media {
						fieldGroupName
						imageOrVideo
						video
						images {
							srcSet
							caption
						}
					}
					... on WpNewsArticle_Singlecontent_Content_Text {
						big
						fieldGroupName
						paragraphContent
					}
				}
			}
		}
	}
`;
