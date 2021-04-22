/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require(`path`)

exports.createPages = async gatsbyUtilities => {
	// Query our posts from the GraphQL server
	const posts = await getPosts(gatsbyUtilities);

	const pages = await getPages(gatsbyUtilities)

	// If there are no posts in WordPress, don't do anything

	if(!posts.length && !pages.length){
		return;
	}

	// If there are posts, create pages for them
	if(posts.length){
		await createIndividualBlogPostPages({ posts, gatsbyUtilities });
	}

	if(pages.length){
		await createPages({ pages, gatsbyUtilities });
	}

	// And a paginated archive
	// await createBlogPostArchive({ posts, gatsbyUtilities });
};

const createIndividualBlogPostPages = async ({ posts, gatsbyUtilities }) => {
	console.log(posts);
	return Promise.all(
		posts.map(({ previous, post, next }) =>
			gatsbyUtilities.actions.createPage({

				path: post.uri,

				component: path.resolve(`./src/templates/blog-post.js`),

				context: {
					id: post.id,
				}
			})
		)
	);
}

const createPages = async ({pages, gatsbyUtilities}) => {
	console.log(pages);
	return Promise.all(
		pages.map(({page}) => {

			// We always need the english page slug to identify the component
			let componentSlug = page.language.slug === `en` ? page.slug : page.translations[0].slug;

			return gatsbyUtilities.actions.createPage({
				
				path: page.uri,

				component: path.resolve(`./src/templates/${componentSlug}.js`),

				context: {
					id: page.id,
					lang: page.language.slug
				}

			})
		})
	);
};


async function getPosts({ graphql, reporter }) {
	const graphqlResult = await graphql(/* GraphQL */ `
		query WpPosts {
			# Query all WordPress blog posts sorted by date
			allWpPost(sort: { fields: [date], order: DESC }) {
				edges {
					post: node {
						id
						uri
						title
					}
				}
			}
		}
	`);

	if (graphqlResult.errors) {
		reporter.panicOnBuild(
			`There was an error loading your blog posts`,
			graphqlResult.errors
		);
		return;
	}

	return graphqlResult.data.allWpPost.edges;
}


async function getPages({ graphql, reporter }) {
	const graphqlResult = await graphql(/* GraphQL */ `
		query WpPages {
			# Query all WordPress pages
			allWpPage {
				edges {
					page: node {
						id
						uri
						title
						slug
						language {
							slug
						}
						translations {
							slug
						}
					}
				}
			}
		}
	`);

	if (graphqlResult.errors) {
		reporter.panicOnBuild(
			`There was an error loading your blog posts`,
			graphqlResult.errors
		);
		return;
	}

	return graphqlResult.data.allWpPage.edges;
}
