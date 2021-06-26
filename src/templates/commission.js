import React from "react";
import { graphql, Link } from "gatsby";
import LangSwitcher from "../components/LangSwitcher";
import Layout from "../components/layout";
import Row from "../components/row";
import Separator from "../components/separator";
import CommissionsGrid from "../components/blockGrids/commissionsGrid";
import Single from "./single";

const Commission = ({ data: { commission }, pageContext }) => {
	let related = pageContext.related.map(commission => {
		let newObj = { node: { ...commission.commission } };
		return newObj;
	});

	let fake = [];

	for (let i = 0; i < 5; i++) {
		console.log(i % 2);
		fake.push(related[i % 2]);
	}

	return (
		<Layout>
			<Single content={commission} />
			<Separator />
			<Row classes="justify-content-center">
				<div className="col col-12">
					<h2>More commissions</h2>
				</div>
				<CommissionsGrid items={fake} />
			</Row>
		</Layout>
	);
};

export default Commission;

export const ProjectData = graphql`
	query commissionById(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$id: String!
	) {
		# selecting the current post by id
		commission: wpCommission(id: { eq: $id }) {
			id
			title
			# singlePostContent {
			# content {
			# 	... on WpCommission_Singlecontent_Content_MediaText {
			# 		direction
			# 		fieldGroupName
			# 		paragraph {
			# 			paragraphContent
			# 			fieldGroupName
			# 			big
			# 		}
			# 		media {
			# 			image {
			# 				caption
			# 				srcSet
			# 			}
			# 			imageOrVideo
			# 			video
			# 		}
			# 	}
			# 	... on WpCommission_Singlecontent_Content_Images {
			# 		fieldGroupName
			# 		images {
			# 			caption
			# 			srcSet
			# 		}
			# 		imageOrVideo
			# 		video
			# 	}
			# 	... on WpCommission_Singlecontent_Content_Text {
			# 		fieldGroupName
			# 		paragraph {
			# 			paragraphContent
			# 			fieldGroupName
			# 			big
			# 		}
			# 	}
			# }
			# }
		}
	}
`;
