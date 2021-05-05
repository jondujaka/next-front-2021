import React from "react";
import { graphql, Link } from "gatsby";
import LangSwitcher from "../components/LangSwitcher";
import Layout from "../components/layout";
import Single from "./single";

const Events = ({ data: { event }, pageContext }) => {
	console.log(pageContext);
	const {settings, edition } = pageContext;

	let langTo = event.language.slug == `sk` ? `` : `/sk`;
	return (
		<Layout settings={settings}>
			<Single content={event} />
		</Layout>
	);
};

export default Events;

export const eventQuery = graphql`
	query eventById(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$id: String!
	) {
		# selecting the current post by id
		event: wpEvent(id: { eq: $id }) {
			id
			title
			language {
				slug
			}
			translations {
				slug
				uri
			}
			singlePostContent {
				content {
					... on WpEvent_Singlepostcontent_Content_MediaText {
						direction
						fieldGroupName
						paragraph {
							paragraphContent
							fieldGroupName
							big
						}
					}
					... on WpEvent_Singlepostcontent_Content_Images {
						fieldGroupName
						imageOrVideo
					}
					... on WpEvent_Singlepostcontent_Content_Text {
						fieldGroupName
						paragraph {
							paragraphContent
							fieldGroupName
							big
						}
					}
				}
			}
		}
	}
`;
