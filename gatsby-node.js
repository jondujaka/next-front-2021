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
};

const fs = require(`fs`);

const getNrItems = (arr, limit, start = 0) => {
	let result = [];
	for (let i = start; i++; i < limit) {
		result.push(arr[i]);
	}
	console.log(`NR ITEMS`);
	console.log(result);
	return result;
};

const initEditions = async gatsbyUtilities => {
	console.log(`init editions`);
	if (editions.length) {
		const promises = [];
		editions.forEach(edition => {
			promises.push(buildEdition(edition, gatsbyUtilities));
		});
		// await createEditions({editions, gatsbyUtilities});
		await Promise.all(promises);
	}
	return;
};

const initProducts = async gatsbyUtilities => {
	const allProducts = await getAllProducts(gatsbyUtilities);
	const createProductsPromises = [];

	allProducts.map(productInfo => {
		const slug = `/products/${productInfo.product.slug}/`;
		const template = `product`;
		const context = {
			id: productInfo.product.id,
			related: allProducts
		};

		createProductsPromises.push(
			createIndividualPage(slug, template, context, gatsbyUtilities)
		);
	});

	Promise.all(createProductsPromises).then(() =>
		console.log(`all products built`)
	);
};

const initPostTypes = async gatsbyUtilities => {
	console.log(`init post types`);
	let articlesSettings = {
		postType: `article`,
		queryName: `allNews`,
		gqlName: `allWpNewsArticle`
	};

	const allNews = await getPostType(articlesSettings, gatsbyUtilities);
	const createNewsPromises = [];

	allNews.map(articleInfo => {
		const slug = articleInfo.article.uri;
		const template = `news-article`;
		const context = {
			id: articleInfo.article.id,
			related: allNews
		};
		createNewsPromises.push(
			createIndividualPage(slug, template, context, gatsbyUtilities)
		);
	});

	let eventSettings = {
		postType: `event`,
		queryName: `allEvents`,
		gqlName: `allWpEvent`
	};
	const allEvents = await getPostType(eventSettings, gatsbyUtilities);
	const createEventPromises = [];
	allEvents.map(eventInfo => {
		const year = eventInfo.event.editions.nodes.length
			? eventInfo.event.editions.nodes.reduce((a, b) =>
					Math.max(parseInt(a.slug), parseInt(b.slug))
			  )
			: 2021;
		const editionSettings = editionsToBuild.find(
			edition => edition.year == year.slug
		);

		if (true) {
			console.log(`building events for: ${year.slug}`);
			const slug = eventInfo.event.uri;
			const template = `event`;
			const context = {
				edition: year,
				id: eventInfo.event.id,
				settings: { ...editionSettings },
				related: allEvents
			};
			createEventPromises.push(
				createIndividualPage(slug, template, context, gatsbyUtilities)
			);
		}
	});

	let artistSettings = {
		postType: `artist`,
		queryName: `allArtists`,
		gqlName: `allWpArtist`
	};
	const allArtists = await getPostType(artistSettings, gatsbyUtilities);
	const createArtistsPromises = [];
	allArtists.map(artistInfo => {
		const year = artistInfo.artist.editions.nodes.length
			? artistInfo.artist.editions.nodes.reduce((a, b) =>
					Math.max(parseInt(a.slug), parseInt(b.slug))
			  )
			: 2021;
		const editionSettings = editionsToBuild.find(
			edition => edition.year == year.slug
		);

		const eventsList = allEvents.flatMap(eventInfo => {
			console.log("-----");
			console.log(artistInfo.artist.id);
			if (eventInfo.event.eventInfo) {
				console.log(eventInfo.event.eventInfo.artists);
			}
			if (
				eventInfo.event.eventInfo &&
				eventInfo.event.eventInfo.artists &&
				eventInfo.event.eventInfo.artists.some(artist => {
					console.log(artist);
					return artist.id === artistInfo.artist.id;
				})
			) {
				return {
					title: eventInfo.event.title,
					url: eventInfo.event.uri,
					eventInfo: eventInfo.event.eventInfo
				};
			} else {
				return [];
			}
		});

		if (true) {
			const slug = artistInfo.artist.uri;
			const template = `artist`;
			const context = {
				edition: year,
				id: artistInfo.artist.id,
				settings: editionSettings ? { ...editionSettings } : {},
				eventsList
			};
			createArtistsPromises.push(
				createIndividualPage(slug, template, context, gatsbyUtilities)
			);
		}
	});

	let projectsSettings = {
		postType: `project`,
		queryName: `allProjects`,
		gqlName: `allWpProject`
	};
	const allProjects = await getPostType(projectsSettings, gatsbyUtilities);
	const createProjectsPromises = [];

	allProjects.map(projectInfo => {
		const slug = projectInfo.project.uri;
		const template = `project`;
		const context = {
			id: projectInfo.project.id,
			related: allProjects
		};
		createProjectsPromises.push(
			createIndividualPage(slug, template, context, gatsbyUtilities)
		);
	});

	let commissionsSettings = {
		postType: `commission`,
		queryName: `allCommissions`,
		gqlName: `allWpCommission`
	};
	const allCommissions = await getPostType(
		commissionsSettings,
		gatsbyUtilities
	);
	const createCommissionsPromises = [];

	allCommissions.length &&
		allCommissions.map(commissionsInfo => {
			const slug = commissionsInfo.commission.uri;
			const template = `commission`;
			const context = {
				id: commissionsInfo.commission.id,
				related: allCommissions
			};
			createCommissionsPromises.push(
				createIndividualPage(slug, template, context, gatsbyUtilities)
			);
		});

	Promise.all([
		...createNewsPromises,
		...createEventPromises,
		...createProjectsPromises,
		...createCommissionsPromises
	]).then(() => console.log(`all post types built`));
};

exports.createPages = async gatsbyUtilities => {
	// const editions = await getEditions(gatsbyUtilities);

	await initEditions(gatsbyUtilities);
	console.log(
		"done with getting edition settings, now main pages, artists, events, etc.."
	);

	initMainPages(gatsbyUtilities);
	initPostTypes(gatsbyUtilities);
	// initProducts(gatsbyUtilities);
};

const buildEdition = async (year, gatsbyUtilities) => {
	// console.log(`start building edition: ${year}`);
	let editionInfo = await getEditionInfo(year, gatsbyUtilities);
	// console.log(editionInfo);

	const editionPages = [
		{
			slug: `programme`,
			template: `programme-template`,
			query: ``
		},
		{
			slug: `artists`,
			template: `artists-template`
		},
		{
			slug: `info`,
			template: `info-template`
		},
		{
			slug: `tickets`,
			template: `tickets-template`
		},
		{
			slug: `workshops`,
			template: `workshops-template`
		}
	];

	console.log(`init edition ${year}`);
	console.log(editionInfo);
	if (
		editionInfo.editionData &&
		editionInfo.editionData.settings.testWebsite
	) {
		// Create the edition

		// Create an index of editions that should be built
		if (!editionsToBuild.find(edition => edition.year === year)) {
			editionsToBuild.push({
				...editionInfo.editionData.settings,
				year
			});
		}

		console.log(`building edition ${year}`);

		const editionIndexPromises = [];
		const editionPagesPromises = [];
		console.log(`Enabled to be built: ${year}`);

		let skPage;
		if (editionInfo.editionData.translations.length) {
			skPage = editionInfo.editionData.translations[0];
		}
		editionPages.forEach(page =>
			editionPagesPromises.push(
				createIndividualPage(
					`/${year}/${page.slug}`,
					page.template,
					{
						edition: `${year}`,
						slug: page.slug,
						querySlug: `/^${page.slug}/`,
						queryType: `/${year}$/`,
						settings: { ...editionInfo.editionData.settings },
						menu: { ...editionInfo.menu }
					},
					gatsbyUtilities
				)
			)
		);
		editionIndexPromises.push(
			createIndividualPage(
				`/${year}/`,
				`edition`,
				{
					edition: `${year}`,
					id: editionInfo.editionData.id,
					lang: `en`,
					translation: skPage ? skPage : {},
					content: { ...editionInfo.editionData.editionContent },
					settings: { ...editionInfo.editionData.settings },
					menu: { ...editionInfo.menu }
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
						content: { ...editionInfo.editionData.editionContent },
						settings: { ...editionInfo.editionData.settings }
					},
					gatsbyUtilities
				)
			);
		}

		await Promise.all([
			...editionIndexPromises,
			...editionPagesPromises
		]).then(() => `Edition build ${year}`);
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

	if (fs.existsSync(template)) {
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

const getAllProducts = async ({ graphql, reporter }) => {
	const gqlResult = await graphql(/* GraphQL */ `
		query allProductsQuery {
			allWpProduct {
				edges {
					product: node {
						name
						slug
						id
					}
				}
			}
		}
	`);

	console.log(`getting products`);
	console.log(`----`);
	console.log(gqlResult);
	console.log(`----`);

	if (gqlResult.errors) {
		reporter.panicOnBuild(
			`There was an error loading your blog posts`,
			gqlResult.errors
		);
		return;
	}

	return gqlResult.data.allWpProduct.edges;
};

const getPostType = async (settings, { graphql, reporter }) => {
	console.log(`getting all posts of type: ${settings.postType}`);

	const withEdition = [`artist`, `event`];
	const noLanguage = [`project`];
	let editionsFragment = `
		editions {
			nodes {
				slug
			}
		}
	`;

	let projectsFragment = `
		projectDescription {
			shortDescription
		}
	`;

	let languagesFragment = `
		language {
			slug
		}
	`;

	let commissionsFragment = `
		featuredImage {
			node {
				sizes
				uri
				description
				caption
				mediaDetails {
					sizes {
						name
						sourceUrl
					}
				}
			}
		}
	`;

	let eventsFragment = `
		eventInfo {
			artists {
				... on WpArtist {
				  	id
				}
			}
			dates {
				startTime
				endTime
				date
			}
		}
	`;

	let editionYearFragment = `
		editions {
			nodes {
				slug
			}
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
						${settings.postType === `project` ? projectsFragment : ``}
						${settings.postType === `commission` ? commissionsFragment : ``}
						${withEdition.includes(settings.postType) ? editionsFragment : ``}
						${noLanguage.includes(settings.postType) ? `` : languagesFragment}
						${
							settings.postType === `artist` ||
							settings.postType === `event`
								? editionYearFragment
								: ``
						}
						${settings.postType === `event` ? eventsFragment : ``}
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
};

const getEditionInfo = async (year, { graphql, reporter }) => {
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
				
				editionContent {
					topText {
						secondTitle
						firstTilte
						editionDate {
						startDate
						endDate
						}
					}
					content {
						... on WpEdition${year}_Editioncontent_Content_WorkshopsSection {
							fieldGroupName
							title
							workshops {
								... on WpWorkshop {
									id
									uri
									title
									featuredImage {
										node {
											mediaDetails {
												sizes {
													sourceUrl
													name
												}
											}
										}
									}
								}
							}
						}
						... on WpEdition${year}_Editioncontent_Content_Link {
							fieldGroupName
							textOrButton
							link {
								title
								url
							}
						}
						... on WpEdition${year}_Editioncontent_Content_Paragraph {
							fieldGroupName
							text
						}
						... on WpEdition${year}_Editioncontent_Content_Title {
							fieldGroupName
							text
						}
						... on WpEdition${year}_Editioncontent_Content_Media {
							fieldGroupName
							mediaType
							video
							images {
								srcSet
							}
						}
						... on WpEdition${year}_Editioncontent_Content_ArtistsSection {
							fieldGroupName
							title
							artists {
								... on WpArtist {
									id
									uri
									title
									featuredImage {
										node {
											mediaDetails {
												sizes {
													sourceUrl
													name
												}
											}
										}
									}
								}
							}
						}
					}
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
			wpMenu(slug: { eq: "edition-${year}" }) {
				name
				slug
				menuItems {
					nodes {
						url
						label
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

	return {
		editionData: graphqlResult.data[`wpEdition${year}`],
		menu: graphqlResult.data.wpMenu
	};
};

const initMainPages = async gatsbyUtils => {
	const mainPagesPromises = [];

	let queries = [
		{
			queryName: `mainHomePage`,
			type: `wpPage`,
			slug: `index`
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

	queries.map(query =>
		mainPagesPromises.push(initSingleMainPage(query, gatsbyUtils))
	);

	Promise.all(mainPagesPromises).then(val =>
		console.log(`all main pages finished`)
	);
};

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

const initSingleMainPage = async (settings, gatsbyUtils) => {
	const pageData = await getSpecificPage(settings, gatsbyUtils);

	if (!pageData) {
		return;
	}

	let slug = pageData.slug;
	let templateSlug = templateMap[pageData.slug];

	let uri = pageData.uri;
	let skUri;

	// Rewrite url for home pages
	if (slug === `index`) {
		uri = `/`;
		skUri = `/sk/`;
	}

	let contextEn = {
		id: pageData.id,
		lang: `en`
	};

	if (slug === `index`) {
		contextEn.availableEditions = editionsToBuild;
	}

	createIndividualPage(uri, templateSlug, { ...contextEn }, gatsbyUtils);

	// SK Version (if it exists)
	if (pageData.translations.length) {
		let skData = pageData.translations[0];
		let contextSk = {
			id: skData.id,
			lang: `sk`
		};

		if (slug === `index`) {
			contextSk.availableEditions = editionsToBuild;
		}

		if (!skUri) {
			skUri = skData.uri;
		}

		createIndividualPage(
			skUri,
			templateSlug,
			{ ...contextSk },
			gatsbyUtils
		);
	}
};
