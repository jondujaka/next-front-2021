import React from "react";
import { graphql, Link } from "gatsby";
import LangSwitcher from "../components/LangSwitcher";
import Layout from "../components/layout";

const Home = ({ data: { page }, pageContext }) => {
	const { translations, language } = { page };
	const { availableEditions } = pageContext;

	console.log(page);

	const langSlug = page.language.slug == `en` ? `/sk` : `/`;
	return (
		<Layout>
			<h1>Main home page - {page.language.slug}</h1>
			{page.translations.length ? <Link to={langSlug}>Switch language</Link> : null}

			<br/>
			<h2>All editions</h2>
			<ul>
				{availableEditions.length && availableEditions.map(edition => {
					const langSlug = page.language.slug == `en` ? `/` : `/sk`;
					return (
						<li key={`edition-${edition.year}`}>
							<Link to={`/${edition.year}${langSlug}`}>Edition {edition.year}</Link>
						</li>
					);
				})}
			</ul>
		</Layout>
	);
};

export default Home;

export const pageQuery = graphql`
	query Homepage(
		# these variables are passed in via createPage.pageContext in gatsby-node.js
		$id: String!
	) {
		# selecting the current page by id
		page: wpPage(id: { eq: $id }) {
			id
			content
			title
			language {
				slug
			}
			translations {
				uri
			}
		}
	}
`;
