import React from "react";
import { graphql, Link } from "gatsby";
import LangSwitcher from "../components/LangSwitcher";
import withPreview from "../components/withPreview";
import Layout from "../components/layout";
import gql from 'graphql-tag';
import Single from './single';

const Artist = ({ data: { artist }, pageContext, preview }) => {
	const { edition, settings } = pageContext;

	let langTo = artist.language.slug == `sk` ? `/sk` : ``;
	const { content } = artist.singlePostContent;

	console.log(preview);
	return (
		<Layout settings={settings}>
			<Link to={`/${edition}${langTo}`}>Home</Link>
			<h1>{artist.title}</h1>
			<LangSwitcher
				link={`/${edition}${langTo}/artist/${artist.translations[0].slug}`}
				text="Switch Language"
			/>

			{/* <Single content={artist} /> */}

			{/* <div className="single-content">
				{content.length && content.map(item => <RowWrapper content={item} />)}
			</div> */}
		</Layout>
	);
};


const RowWrapper = ({ content }) => {
	return (
		<div className="row">
			
			{content.direction ? <DirectionalRow row={content} /> : <Row row={content} /> }
		</div>
	);
};

const Row = ({ row }) => {
	return (
		<>
			{row.media ? <Media media="Fake media here" /> : null}
			{row.paragraph ? <Paragraph content={row.paragraph} /> : null }
		</>
	);
};

const DirectionalRow = ({row}) => {
	if(row.direction === `media_text`){
		return (
			<>
				<Media media="Fake media here" />
				<Paragraph content={row.paragraph} />
			</>
		);
	}
}
const Media = ({media}) => <div className="fake-media">{media}</div>;

const Paragraph = ({content}) => <div className={`paragraph text-${content.big}`} dangerouslySetInnerHTML={{__html: content.paragraphContent}}/>;

export const artistQuery = graphql`
	query artistById(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$id: String!
	) {
		# selecting the current post by id
		artist: wpArtist(id: { eq: $id }) {
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
					... on WpArtist_Singlepostcontent_Content_MediaText {
						direction
						fieldGroupName
						paragraph {
							paragraphContent
							fieldGroupName
							big
						}
					}
					... on WpArtist_Singlepostcontent_Content_Images {
						fieldGroupName
						imageOrVideo
					}
					... on WpArtist_Singlepostcontent_Content_Text {
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


const PREVIEW_QUERY = gql`
  query getPreview($id: Int!) {
    wpArtist(id:{eq: $id}) {
      title
    }
  }
`;


export default withPreview({ preview: PREVIEW_QUERY })(Artist);
