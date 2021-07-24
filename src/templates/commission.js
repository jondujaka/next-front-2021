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
		fake.push(related[i % 2]);
	}

	return (
		<Layout>
			<Row>
				<div className="col col-12 mt-5 mb-6">
					<h2 className="festival-page-title">
						<Link className="inherit" to="/commissions">Commissions</Link> > {commission.title}
					</h2>
				</div>
			</Row>
			<Single content={commission} />
			<Separator />
			<Row classes="justify-content-center">
				<div class="col col-12 mt-5 mb-6"><h1>More commissions</h1></div>
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
		commission: wpCommission(id: { eq: $id }) {
			id
			title
			singleContent {
				content {
					... on WpCommission_Singlecontent_Content_Text {
						big
						fieldGroupName
						paragraphContent
					}
					... on WpCommission_Singlecontent_Content_Media {
						fieldGroupName
						imageOrVideo
						images {
							caption
							srcSet
						}
						video
					}
					... on WpCommission_Singlecontent_Content_MediaText {
						fieldGroupName
						media {
							imageOrVideo
							video
							image {
								caption
								srcSet
							}
						}
					}
				}
			}
		}
	}
`;
