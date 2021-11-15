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
		`gatsby-plugin-gatsby-cloud`,

		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.dev/offline
		`gatsby-plugin-offline`,
		`gatsby-plugin-sitemap`,
		`gatsby-plugin-client-side-redirect`
	]
};
