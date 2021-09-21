/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require(`path`);
const editions = [2021];
const editionsToBuild = [];
const templateMap = {
	news: `news-page`,
	about: `about`,
	index: `home`,
	commissions: `commissions`,
	projects: `projects`,
	shop: `shop`,
	records: `records`
};

const getLatestEdition = () =>
	editionsToBuild.length &&
	editionsToBuild.reduce((prev, current) => {
		return prev.year > current.year ? prev : current;
	});

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
		const slug = `/product/${productInfo.product.slug}/`;
		const template = `product`;
		const context = {
			id: productInfo.product.id,
			related: allProducts,
			lang: `en`
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

	initProducts(gatsbyUtilities);

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
			related: allNews,
			lang: articleInfo.article.language.slug,
			latestEdition: getLatestEdition()
		};
		createNewsPromises.push(
			createIndividualPage(slug, template, context, gatsbyUtilities)
		);

		// if (articleInfo.article.translations.length) {
		// 	console.log(`building news, slovak`);
		// 	const slug = `/sk/news/${articleInfo.article.translations[0].slug}`;
		// 	const template = `news-article`;
		// 	const context = {
		// 		id: articleInfo.article.translations[0].id,
		// 		lang: `sk`,
		// 		latestEdition: getLatestEdition()
		// 	};
		// 	createNewsPromises.push(
		// 		createIndividualPage(slug, template, context, gatsbyUtilities)
		// 	);
		// }
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

		{
			console.log(`building events for: ${year.slug}, english`);
			const slug = eventInfo.event.uri;
			const template = `event`;
			const context = {
				edition: year,
				id: eventInfo.event.id,
				settings: { ...editionSettings },
				related: allEvents,
				lang: eventInfo.event.language.slug
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
			if (
				eventInfo.event.eventInfo &&
				eventInfo.event.eventInfo.artists &&
				eventInfo.event.eventInfo.artists.some(artist => {
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

		{
			const slug = artistInfo.artist.uri;
			const template = `artist`;
			const context = {
				year: year.slug,
				id: artistInfo.artist.id,
				settings: editionSettings ? { ...editionSettings } : {},
				eventsList,
				lang: artistInfo.artist.language.slug
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
			related: allProjects,
			latestEdition: getLatestEdition(),
			lang: projectInfo.project.language.slug
		};
		createProjectsPromises.push(
			createIndividualPage(slug, template, context, gatsbyUtilities)
		);

		// if (projectInfo.project.translations.length) {
		// 	console.log(`building projects, slovak`);
		// 	const slug = `/sk/projects/${projectInfo.project.translations[0].slug}`;
		// 	const template = `project`;
		// 	const context = {
		// 		id: projectInfo.project.translations[0].id,
		// 		lang: `sk`,
		// 		latestEdition: getLatestEdition()
		// 	};
		// 	createProjectsPromises.push(
		// 		createIndividualPage(slug, template, context, gatsbyUtilities)
		// 	);
		// }
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
				related: allCommissions.slice(0, 5),
				latestEdition: getLatestEdition(),
				lang: commissionsInfo.commission.language.slug
			};
			createCommissionsPromises.push(
				createIndividualPage(slug, template, context, gatsbyUtilities)
			);

			// if (commissionsInfo.commission.translations.length) {
			// 	console.log(`building commissions, slovak`);
			// 	const slug = `/sk/commissions/${commissionsInfo.commission.translations[0].slug}`;
			// 	const template = `commission`;
			// 	const context = {
			// 		id: commissionsInfo.commission.translations[0].id,
			// 		lang: `sk`,
			// 		latestEdition: getLatestEdition(),
			// 		related: allCommissions.slice(0, 5),
			// 	};
			// 	createCommissionsPromises.push(
			// 		createIndividualPage(
			// 			slug,
			// 			template,
			// 			context,
			// 			gatsbyUtilities
			// 		)
			// 	);
			// }
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

	initPostTypes(gatsbyUtilities);
	initMainPages(gatsbyUtilities);

	// initProducts(gatsbyUtilities);
};

const buildEdition = async (year, gatsbyUtilities) => {
	// console.log(`start building edition: ${year}`);
	let editionInfo = await getEditionInfo(year, gatsbyUtilities);
	// console.log(editionInfo);

	const editionPages = [
		{
			slug: `programme`,
			template: `programme-template`
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

	if (
		editionInfo &&
		editionInfo.editionData &&
		editionInfo.editionData.settings
	) {
		// Create the edition

		let shouldBuild = false;
		let isDev =
			process.env.GATSBY_IS_PREVIEW ||
			process.env.NODE_ENV === `development`;
		let { liveWebsite, testWebsite } = editionInfo.editionData.settings;

		if (isDev) {
			shouldBuild = liveWebsite || testWebsite;
			console.log(`build test or live edition ${year}`);
		} else {
			shouldBuild = liveWebsite || false;
			console.log(`build only live edition ${year}`);
		}

		if (!shouldBuild) {
			return;
		}
		// Create an index of editions that should be built
		if (!editionsToBuild.find(edition => edition.year === year)) {
			console.log(`building edition ${year}`);
			editionsToBuild.push({
				...editionInfo.editionData.settings,
				menu: editionInfo.menu,
				skMenu: editionInfo.skMenu,
				year,
				content: editionInfo.editionData
			});
		}

		console.log(`building edition ${year}`);

		const editionIndexPromises = [];
		const editionPagesPromises = [];
		console.log(`Enabled to be built: ${year}`);

		let skPage;
		if (
			editionInfo.editionData.translations &&
			editionInfo.editionData.translations.length
		) {
			skPage = editionInfo.editionData.translations[0];
		}
		editionPages.forEach(page => {
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
						menu: { ...editionInfo.menu },
						lang: "en"
					},
					gatsbyUtilities
				)
			);

			editionPagesPromises.push(
				createIndividualPage(
					`/sk/${year}/${page.slug}`,
					page.template,
					{
						edition: `${year}`,
						slug: `/sk/${page.slug}`,
						querySlug: `/^${page.slug}/`,
						queryType: `/${year}$/`,
						settings: { ...editionInfo.editionData.settings },
						menu: { ...editionInfo.menu },
						skMenu: { ...editionInfo.skMenu },
						lang: "sk"
					},
					gatsbyUtilities
				)
			);
		});

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
						settings: { ...editionInfo.editionData.settings },
						menu: { ...editionInfo.menu },
						skMenu: { ...editionInfo.skMenu }
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

	const withEdition = [`artist`, `event`, `workshop`];
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
			venue {
				... on WpVenue {
				  uri
				  title
				  slug
				  venueInfo {
					mapsLink
				  }
				}
			  }
			dates {
				starttime
				endtime
				date
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
						language {
							slug
						}
						translations {
							slug
							id
							uri
							title
						}
						${settings.postType === `project` ? projectsFragment : ``}
						${settings.postType === `commission` ? commissionsFragment : ``}
						${withEdition.includes(settings.postType) ? editionsFragment : ``}
						${noLanguage.includes(settings.postType) ? `` : languagesFragment}
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
				translations {
					slug
					id
				}
				editionContent {
					fieldGroupName
					content {
						... on WpEdition2021_Editioncontent_Content_WorkshopsSection {
							fieldGroupName
							title
							workshops {
							  ... on WpEvent {
								id
								uri
								title
								artistEventContent {
									images {
										srcSet
									}
								}
								language {
									slug
								}
								translations {
									uri
									title
								}
							  }
							}
						  }
					  ... on WpEdition2021_Editioncontent_Content_ArtistsSection {
						fieldGroupName
						title
						artists {
						  ... on WpArtist {
							id
							uri
							title
							artistEventContent {
								images {
									srcSet
								}
							}
							language {
								slug
							}
							translations {
								uri
								title
							}
						  }
						}
					  }
					  ... on WpEdition2021_Editioncontent_Content_Link {
						fieldGroupName
						textOrButton
						link {
						  url
						  title
						}
					  }
					  ... on WpEdition2021_Editioncontent_Content_Paragraph {
						fieldGroupName
						text
					  }
					  ... on WpEdition2021_Editioncontent_Content_Title {
						fieldGroupName
						text
					  }
					  ... on WpEdition2021_Editioncontent_Content_Media {
						fieldGroupName
						mediaType
						images {
						  srcSet
						}
						video
					  }
					}
					topText {
					  firstTilte
					  secondTitle
					  fieldGroupName
					  editionDate {
						fieldGroupName
						endDate
						startDate
					  }
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
			skMenu: wpMenu(slug: { eq: "sk-edition-${year}" }) {
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
		menu: graphqlResult.data.wpMenu,
		skMenu: graphqlResult.data.skMenu
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
		},
		{
			queryName: `mainShopPage`,
			type: `wpPage`,
			slug: `shop`
		},
		{
			queryName: `mainRecordsPage`,
			type: `wpPage`,
			slug: `records`
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
					title
				}
				slug
				uri
				title
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
		lang: `en`,
		title: pageData.title,
		latestEdition: getLatestEdition()
	};

	createIndividualPage(uri, templateSlug, { ...contextEn }, gatsbyUtils);

	// SK Version (if it exists)
	if (pageData.translations.length) {
		let skData = pageData.translations[0];
		let contextSk = {
			id: skData.id,
			lang: `sk`,
			title: skData.title,
			latestEdition: getLatestEdition()
		};

		if (!skUri) {
			skUri = `sk/${pageData.slug}`;
		}

		createIndividualPage(
			skUri,
			templateSlug,
			{ ...contextSk },
			gatsbyUtils
		);
	}
};
