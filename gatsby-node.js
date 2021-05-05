/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require(`path`);
const editions = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
const editionsToBuild = [];

exports.createPages = async gatsbyUtilities => {
	// const editions = await getEditions(gatsbyUtilities);


	const allNews = await getAllNewsArticles(gatsbyUtilities);
	const createNewsPromises = [];

	allNews.map(articleInfo => {
		console.log(articleInfo);
		const slug = articleInfo.article.uri;
		const template = `news-article`;
		const context = {
			id: articleInfo.article.id,
		};
		createNewsPromises.push(
			createIndividualPage(slug, template, context, gatsbyUtilities)
		);
	});

	Promise.all(createNewsPromises);

	if (editions.length) {
		const promises = [];
		editions.forEach(edition => {
			promises.push(buildEdition(edition, gatsbyUtilities));
		});
		// await createEditions({editions, gatsbyUtilities});
		await Promise.all(promises);
	}

	console.log("done with editions, now start with artists");

	const allArtists = await getAllArtists(gatsbyUtilities);
	const createArtistsPromises = [];

	allArtists.map(artistInfo => {
		const year = artistInfo.artist.Edition.year.name;
		const editionSettings = editionsToBuild.find(
			edition => edition.year == year
		);

		if (editionSettings.testWebsite) {
			const slug = artistInfo.artist.uri;
			const template = `artist`;
			const context = {
				edition: year,
				id: artistInfo.artist.id,
				settings: { ...editionSettings }
			};
			createArtistsPromises.push(
				createIndividualPage(slug, template, context, gatsbyUtilities)
			);
		}
	});

	Promise.all(createArtistsPromises);

	const allEvents = await getAllEvents(gatsbyUtilities);
	const createEventPromises = [];

	allEvents.map(eventInfo => {
		const year = eventInfo.event.Edition.year.name;
		const lang = eventInfo.event.language
			? eventInfo.event.language.slug
			: null;

		console.log(`event ${year}`);
		console.log(JSON.stringify(editionsToBuild));

		const editionSettings = editionsToBuild.find(
			edition => edition.year == year
		);

		if (editionSettings.testWebsite) {
			console.log(`building events for: ${year}`);
			const slug = eventInfo.event.uri;
			const template = `event`;
			const context = {
				edition: year,
				id: eventInfo.event.id,
				settings: { ...editionSettings }
			};
			createEventPromises.push(
				createIndividualPage(slug, template, context, gatsbyUtilities)
			);
		}
	});

	Promise.all(createEventPromises);

	const mainHome = await getMainHomePage(gatsbyUtilities);

	buildMainHome(mainHome, gatsbyUtilities);
};

const buildMainHome = async (mainHome, gatsbyUtilities) => {
	const homePromises = [];

	let skHome;
	if (mainHome.translations.length) {
		skHome = mainHome.translations[0];
	}

	homePromises.push(
		createIndividualPage(
			`/`,
			`home`,
			{
				availableEditions: editionsToBuild,
				id: mainHome.id,
				lang: `en`,
				translation: skHome ? skHome : {}
			},
			gatsbyUtilities
		)
	);
	if (skHome) {
		homePromises.push(
			createIndividualPage(
				`/sk`,
				`home`,
				{
					availableEditions: editionsToBuild,
					id: skHome.id,
					lang: `sk`,
					translation: { language: { slug: `en` } }
				},
				gatsbyUtilities
			)
		);
	}
	await Promise.all(homePromises);
};

const buildEdition = async (year, gatsbyUtilities) => {
	console.log(`start building edition: ${year}`);
	let editionInfo = await getEditionInfo(year, gatsbyUtilities);
	// console.log(editionInfo);

	if (editionInfo && editionInfo.settings.testWebsite) {
		// Create the edition

		// Create an index of editions that should be built
		if(!editionsToBuild.find(edition => edition.year === year)){
			editionsToBuild.push({ ...editionInfo.settings, year });
		}
		

		const editionIndexPromises = [];
		console.log(`Enabled to be built: ${year}`);

		let skPage;
		if (editionInfo.translations.length) {
			skPage = editionInfo.translations[0];
		}
		editionIndexPromises.push(
			createIndividualPage(
				`/${year}`,
				`edition`,
				{
					edition: `${year}`,
					id: editionInfo.id,
					lang: `en`,
					translation: skPage ? skPage : {},
					settings: { ...editionInfo.settings }
				},
				gatsbyUtilities
			)
		);
		if (skPage) {
			editionIndexPromises.push(
				createIndividualPage(
					`/sk/${year}/`,
					`edition`,
					{
						edition: `${year}`,
						id: skPage.id,
						lang: `sk`,
						translation: { language: { slug: `en` } },
						settings: { ...editionInfo.settings }
					},
					gatsbyUtilities
				)
			);
		}

		await Promise.all(editionIndexPromises);
	}
	return;
};

const createIndividualPage = async (
	slug,
	templateSlug,
	context = {},
	{ actions }
) => {
	console.log(`building page: ${slug}`);
	const { createPage } = actions;

	const template = path.resolve(`src/templates/${templateSlug}.js`);

	createPage({
		path: slug,
		component: template,
		context: { ...context }
	});
};

const getAllArtists = async ({ graphql, reporter }) => {
	console.log(`getting all artists`);

	const graphqlResult = await graphql(/* GraphQL */ `
		query allArtists {
			# Query index pages from edition
			allWpArtist {
				edges {
					artist: node {
						slug
						title
						id
						uri
						Edition {
							year {
								name
							}
						}
						language {
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

	return graphqlResult.data.allWpArtist.edges;
};

const getAllEvents = async ({ graphql, reporter }) => {
	console.log(`getting all events`);

	const graphqlResult = await graphql(/* GraphQL */ `
		query allEvents {
			# Query index pages from edition
			allWpEvent {
				edges {
					event: node {
						slug
						title
						id
						uri
						Edition {
							year {
								name
							}
						}
						language {
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

	return graphqlResult.data.allWpEvent.edges;
};

const getAllNewsArticles = async ({ graphql, reporter }) => {
	console.log(`getting all news`);

	const graphqlResult = await graphql(/* GraphQL */ `
		query allNews {
			# Query index pages from edition
			allWpNewsArticle {
				edges {
					article: node {
						slug
						title
						id
						uri
						language {
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

	return graphqlResult.data.allWpNewsArticle.edges;
};

const getMainHomePage = async ({ graphql, reporter }) => {
	const graphqlResult = await graphql(/* GraphQL */ `
		query mainHomePage {
			# Query index pages from edition
			wpPage(slug: { eq: "index" }, language: { slug: { eq: "en" } }) {
				id
				language {
					slug
				}
				translations {
					slug
					id
					language {
						slug
					}
				}
				slug
				uri
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

	return graphqlResult.data.wpPage;
};

async function getEditionInfo(year, { graphql, reporter }) {
	console.log(`getting edition: ${year}`);
	const graphqlResult = await graphql(/* GraphQL */ `
		query editionSettings {
			# Query index pages from edition
			wpEdition${year}( slug: {regex: "/^index/"}, language: {slug: { eq: "en"}}) {
				id
				settings: editionSettings {
					textColor
					backgroundColor
					testWebsite
					liveWebsite
					fieldGroupName
				}
				language {
					slug
				}
				translations {
					slug
					id
					language {
						slug
					}
				}
				slug
				uri
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

	return graphqlResult.data[`wpEdition${year}`];
}

async function getEditions({ graphql, reporter }) {
	const graphqlResult = await graphql(/* GraphQL */ `
		query editions {
			# Query all WordPress blog posts sorted by date
			allWpContentType(
				filter: {
					name: { regex: "/^edition-/" }
					contentNodes: {
						nodes: { elemMatch: { slug: { eq: "index" } } }
					}
				}
			) {
				edges {
					edition: node {
						name
						contentNodes {
							nodes {
								id
								slug
								uri
							}
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

	return graphqlResult.data.allWpContentType.edges;
}

async function getPages({ graphql, reporter }) {
	const graphqlResult = await graphql(/* GraphQL */ `
		query WpPages {
			# Query all WordPress pages
			  {
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
