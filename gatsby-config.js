require("dotenv").config({
	path: `.env`
});

module.exports = {
	siteMetadata: {
		title: `Next 2021`,
		description: `Next Festival 2021 Edition`,
		author: `@jondujaka`,
		siteUrl: `https://nextfestival.sk`
	},
	plugins: [
		{
			resolve: `gatsby-source-wordpress`,
			options: {
				url: `https://nextcontent.a2hosted.com/graphql`,
				verboseOutput: true,
				debug: {
					graphql: {
						showQueryVarsOnError: true,
						showQueryOnError: true
					}
				},
				schema: {
					perPage: 50,
					requestConcurrency: 5
				},
				type: {
					MediaItem: { createFileNodes: false }
				},
				production: {
					allow404Images: true
				},
				development: {
					allow404Images: true
				}
			}
		},
		`gatsby-plugin-react-helmet`,
		`gatsby-plugin-image`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: `${__dirname}/src/images`
			}
		},
		{
			resolve: `gatsby-plugin-sass`,
			options: {
				sassOptions: {
					includePaths: [
						require("path").resolve(__dirname, "node_modules")
					]
				}
			}
		},
		`gatsby-transformer-sharp`,
		`gatsby-plugin-sharp`,
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `NEXT Festival`,
				short_name: `NEXT`,
				start_url: `/`,
				background_color: `#4c45fa`,
				theme_color: `#4c45fa`,
				display: `minimal-ui`,
				icon: `${__dirname}/src/images/favicon/next.png` // This path is relative to the root of the site.
			}
		},
		{
			resolve: "gatsby-plugin-matomo",
			options: {
				siteId: "1",
				matomoUrl: "https://nextcontent.a2hosted.com/stats/",
				siteUrl: "https://nextfestival.sk"
			}
		},
		`gatsby-plugin-gatsby-cloud`,
		{
			resolve: `gatsby-plugin-snipcart-advanced`,
			options: {
				version: "3.0.29",
				publicApiKey:
					"MGMzMzNkNWMtMWRmZC00NDJkLWIyNjgtMmFlODYxNDBiMWIwNjM3NzUyODg3MzUxOTkzMjE2",
				defaultLang: "en",
				currency: "eur",
				openCartOnAdd: false,
				useSideCart: true
				// be careful with this mode cart. The cart in this mode has a bug of scroll in firefox
				// locales: {
				// 	fr: {
				// 		actions: {
				// 			checkout: "Valider le panier"
				// 		}
				// 	}
				// },
				// templatesUrl:
				// 	"path on your template file. Set file in the static folder, ex: '/snipcart/index.html'",
				// // not work on dev. Gatsby not serve html file in dev https://github.com/gatsbyjs/gatsby/issues/13072
				// innerHTML: `
				//   <billing section="bottom">
				// 	  <!-- Customization goes here -->
				//   </billing>`
			}
		},

		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.dev/offline
		`gatsby-plugin-offline`,
		`gatsby-plugin-sitemap`,
		`gatsby-plugin-netlify`,
		`gatsby-plugin-client-side-redirect`
	]
};
