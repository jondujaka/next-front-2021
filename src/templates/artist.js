import React from "react";
import { graphql, Link } from "gatsby";
import withPreview from '../components/withPreview';
import LangSwitcher from "../components/LangSwitcher";
import Layout from "../components/layout";
import gql from "graphql-tag";
import Row from "../components/row";
import Image from "../components/image";
import Carousel from "../components/carousel";
import SimpleContent from "../components/simpleContent";
import EventInfo from "../components/eventInfo";

const Artist = ({ data: { artist }, pageContext, preview }) => {
	const { lang, year, settings, eventsList, menu } = pageContext;

	const content = artist.artistEventContent;

	if(preview){
		console.log(`preview`);

		return <h1>Preview</h1>
	}

	return (
		<Layout
			style={{
				color: settings.textColor,
				backgroundColor: settings.backgroundColor
			}}
			editionHeader={settings.menu}
			year={year}
		>
			{!content.content ? (
				<h1>No content yet</h1>
			) : (
				<Row>
				<div className="col-12 text-center mt-4 mb-lg-6 mb-4">
						<h1>{artist.title}</h1>
					</div>
					<div className="col-12 make-first col-lg-6 sticky-carousel mb-6">
						{content.images && (
							<>
								{content.images.length > 1 ? (
									<Carousel
										items={content.images}
										style={{ color: settings.textColor }}
									/>
								) : (
									<Image srcSet={content.images[0].srcSet} />
								)}
							</>
						)}
					</div>
					<div className="col-12 col-lg-6">
						{eventsList.map((event, i) => (
							<EventInfo event={event} key={`even	t-${i}`} />
						))}
						{content.content.map(section => (
							<SimpleContent
								section={section}
								key={section.fieldGroupName}
							/>
						))}
						{content.content.map(section => (
							<SimpleContent
								section={section}
								key={section.fieldGroupName}
							/>
						))}
					</div>
				</Row>
			)}
		</Layout>
	);
};

export const artistQuery = graphql`
	query artistById(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$id: String!
	) {
		# selecting the current post by id
		artist: wpArtist(id: { eq: $id }) {
			id
			title
			databaseId
			language {
				slug
			}
			translations {
				slug
				uri
			}
			artistEventContent {
				images {
					srcSet
				}
				content {
					... on WpArtist_Artisteventcontent_Content_Media {
						fieldGroupName
						imageOrVideo
						video
						image {
							srcSet
						}
					}
					... on WpArtist_Artisteventcontent_Content_Text {
						fieldGroupName
						text
					}
				}
			}
		}
	}
`;

const PREVIEW_QUERY = gql`
  query getPreview($id: Int!) {
    wpArtist(id: { eq: $id}) {
      title
	  id
      revisions {
        nodes {
          id
          title
          content
        }
      }
    }
  }
`;

export default withPreview({ preview: PREVIEW_QUERY })(Artist);

