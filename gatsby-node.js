/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require(`path`);
const editions = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
const editionsToBuild = [];
const templateMap = {
	news: `news-page`,
	about: `about`,
	index: `home`,
	commissions: `commissions`,
	projects: `projects`
}

const fs = require(`fs`);

exports.createPages = async gatsbyUtilities => {
	// const editions = await getEditions(gatsbyUtilities);

	if (editions.length) {
		const promises = [];
		editions.forEach(edition => {
			promises.push(buildEdition(edition, gatsbyUtilities));
		});
		// await createEditions({editions, gatsbyUtilities});
		await Promise.all(promises);
	}

	console.log("done with getting edition settings, now main pages, artists, events, etc..");
	
	initMainPages(gatsbyUtilities);

	let articlesSettings = {
		postType: `article`,
		queryName: `allNews`,
		gqlName: `allWpNewsArticle`
	}

	const allNews = await getPostType(articlesSettings, gatsbyUtilities);
	const createNewsPromises = [];

	allNews.map(articleInfo => {
		const slug = articleInfo.article.uri;
		const template = `news-article`;
		const context = {
			id: articleInfo.article.id
		};
		createNewsPromises.push(
			createIndividualPage(slug, template, context, gatsbyUtilities)
		);
	});

	let artistSettings = {
		postType: `artist`,
		queryName: `allArtists`,
		gqlName: `allWpArtist`
	};
	const allArtists = await getPostType(artistSettings, gatsbyUtilities);
	const createArtistsPromises = [];

	allArtists.map(artistInfo => {
		const year = artistInfo.artist.editions.nodes.reduce((a, b) =>
			Math.max(parseInt(a.slug), parseInt(b.slug))
		);
		const editionSettings = editionsToBuild.find(
			edition => edition.year == year.slug
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

	

	let eventSettings = {
		postType: `event`,
		queryName: `allEvents`,
		gqlName: `allWpEvent`
	}
	const allEvents = await getPostType(eventSettings, gatsbyUtilities);
	const createEventPromises = [];

	allEvents.map(eventInfo => {
		const year = eventInfo.event.editions.nodes.reduce((a, b) =>
			Math.max(parseInt(a.slug), parseInt(b.slug))
		);
		const editionSettings = editionsToBuild.find(
			edition => edition.year == year.slug
		);

		if (editionSettings.testWebsite) {
			console.log(`building events for: ${year.slug}`);
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

	
	let projectsSettings = {
		postType: `project`,
		queryName: `allProjects`,
		gqlName: `allWpProject`
	}
	const allProjects = await getPostType(projectsSettings, gatsbyUtilities);
	const createProjectsPromises = [];

	allProjects.map(projectInfo => {

		const slug = projectInfo.project.uri;
		const template = `project`;
		const context = {
			id: projectInfo.project.id
		};
		createProjectsPromises.push(
			createIndividualPage(slug, template, context, gatsbyUtilities)
		);
	});

	Promise.all([
		...createNewsPromises,
		...createArtistsPromises,
		...createEventPromises,
		...createProjectsPromises
	]);
};


const buildEdition = async (year, gatsbyUtilities) => {
	// console.log(`start building edition: ${year}`);
	let editionInfo = await getEditionInfo(year, gatsbyUtilities);
	// console.log(editionInfo);

	if (editionInfo && editionInfo.settings.testWebsite) {
		// Create the edition

		// Create an index of editions that should be built
		if (!editionsToBuild.find(edition => edition.year === year)) {
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
	const { createPage } = actions;

	const template = path.resolve(`src/templates/${templateSlug}.js`);

	if(fs.existsSync(template)){
		console.log(`building page: ${slug}`);
		createPage({
			path: slug,
			component: template,
			context: { ...context }
		});
	} else {
		console.warn(`Template doesn't exist: ${templateSlug}`);
	}

	
};

const getPostType = async (settings, {graphql, reporter}) => {
	console.log(`getting all posts of type: ${settings.postType}`);

	const withEdition = [
		`artist`,
		`event`
	];
	const noLanguage = [
		`project`
	]
	let editionsFragment = `
		editions {
			nodes {
				slug
			}
		}
	`;

	let languagesFragment = `
		language {
			slug
		}
	`;

	const graphqlResult = await graphql(/* GraphQL */ `
		query ${settings.queryName} {
			# Query index pages from edition
			${settings.gqlName} {
				edges {
					${settings.postType}: node {
						slug
						title
						id
						uri
						${withEdition.includes(settings.postType) ? editionsFragment : ``}
						${noLanguage.includes(settings.postType) ? `` : languagesFragment}
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

	return graphqlResult.data[settings.gqlName].edges;

}

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

const initMainPages = async(gatsbyUtils) => {
	const mainPagesPromises = [];

	let queries = [
		{
			queryName: `mainHomePage`,
			type: `wpPage`,
			slug: `index`,
		},
		{
			queryName: `mainAboutPage`,
			type: `wpPage`,
			slug: `about`
		},
		{
			queryName: `mainCommissionsPage`,
			type: `wpPage`,
			slug: `commissions`
		},
		{
			queryName: `mainNewsPage`,
			type: `wpPage`,
			slug: `news`
		},
		{
			queryName: `mainProjectsPage`,
			type: `wpPage`,
			slug: `projects`
		}
	];

	queries.map(query => mainPagesPromises.push(initSingleMainPage(query, gatsbyUtils)));

	Promise.all(mainPagesPromises).then(val => console.log(`all main pages finished`))
}

const getSpecificPage = async (settings, { graphql, reporter }) => {
	const graphqlResult = await graphql(/* GraphQL */ `
		query ${settings.queryName} {
			${settings.type}(slug: { eq: "${settings.slug}"}, language: { slug: {eq: "en"}}){
				id
				language {
					slug
				}
				translations {
					slug
					uri
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

	console.log(settings.slug);
	console.log(graphqlResult);

	return graphqlResult.data[`${settings.type}`];
};

const initSingleMainPage = async(settings, gatsbyUtils) => {
	
	const pageData = await getSpecificPage(settings, gatsbyUtils);

	if(!pageData){
		return;
	}
	
	let slug = pageData.slug;
	let templateSlug = templateMap[pageData.slug];

	let uri = pageData.uri;
	let skUri;

	// Rewrite url for home pages
	if(slug === `index`){
		uri = `/`;
		skUri = `/sk`
	}

	let contextEn = {
		id: pageData.id,
		lang: `en`,
	}


	if(slug === `index`){
		contextEn.availableEditions = editionsToBuild;
	};

	createIndividualPage(
		uri,
		templateSlug,
		{... contextEn},
		gatsbyUtils
	);


	// SK Version (if it exists)
	if(pageData.translations.length){
		let skData = pageData.translations[0];
		let contextSk = {
			id: skData.id,
			lang: `sk`
		};

		if(slug === `index`){
			contextSk.availableEditions = editionsToBuild;
		}

		if(!skUri){
			skUri = skData.uri;
		}

		createIndividualPage(
			skUri,
			templateSlug,
			{... contextSk},
			gatsbyUtils
		)
	}
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
