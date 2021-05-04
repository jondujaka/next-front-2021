require('dotenv').config({
	path: `.env`
});

module.exports = {
	pathPrefix: `/next-front-2021/public`,
	siteMetadata: {
		title: `Next 2021`,
		description: `Next Festival 2021 Edition`,
		author: `@jondujaka`
	},
	plugins: [
		{
			resolve: `gatsby-source-wordpress`,
			options: {
				url: process.env.WP_GRAPHQL_URL
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
				name: `gatsby-starter-default`,
				short_name: `starter`,
				start_url: `/`,
				background_color: `#663399`,
				theme_color: `#663399`,
				display: `minimal-ui`,
				icon: `${__dirname}/src/images/gatsby-icon.png` // This path is relative to the root of the site.
			}
		},
		`gatsby-plugin-gatsby-cloud`
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.dev/offline
		// `gatsby-plugin-offline`,
	]
};
