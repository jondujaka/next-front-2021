import React from "react";
import { graphql, Link } from "gatsby";
import LangSwitcher from "../components/LangSwitcher";
import Layout from "../components/layout";
import Single from "./single";

const NewsArticle = ({ data: { article }, pageContext }) => {
	return (
		<Layout>
			<Single content={article} />
		</Layout>
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
