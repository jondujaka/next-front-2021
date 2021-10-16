import React from "react";
import { graphql, Link } from "gatsby";
import LangSwitcher from "../components/LangSwitcher";
import Layout from "../components/layout";
import Row from "../components/row";
import Separator from "../components/separator";
import CommissionsGrid from "../components/blockGrids/commissionsGrid";
import Single from "./single";

const Commission = ({ data: { commission }, pageContext }) => {
	let related = pageContext.related ? pageContext.related.map(commission => {
		let newObj = { node: { ...commission.commission } };
		return newObj;
	}) : [];

	const { latestEdition } = pageContext;

	const langSlug = pageContext.lang === `en` ? `sk/` : ``;
	const isSk = pageContext.lang === `sk`;
	const translationSlug = commission.translations.length
		? commission.translations[0].url
		: null;

	return (
		<Layout isSk={isSk} translationSlug={translationSlug} style={latestEdition}>
			<Row>
				<div className="col col-12 mt-5 mb-6">
					<h2 className="festival-page-title">
						<Link className="inherit" to="/commissions">
							Commissions
						</Link>
						{` > ${commission.title}`}
					</h2>
				</div>
			</Row>
			<Single content={commission} />
			{related.length ? (
				<>
					<Separator />
					<Row classes="justify-content-center">
						<div class="col col-12 mb-5 mt-lg-5 mb-lg-6">
							<h1>{isSk ? `Viac objednávok` : `More commissions`}</h1>
						</div>
						<CommissionsGrid items={related} />
					</Row>
				</>
			) : (
				``
			)}
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
			translations {
				uri
			}
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
