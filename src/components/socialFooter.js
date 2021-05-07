import React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";

const SocialFooter = () => {
	const menuData = useStaticQuery(graphql`
		query SocialMenuQuery {
			wpMenu(slug: { eq: "social-links" }) {
				id
				menuItems {
					nodes {
						url
						label
						id
					}
				}
			}
		}
	`);

	const menuItems = menuData.wpMenu.menuItems.nodes;

	console.log(menuData);

	return (
		<div className="social-footer">
			<div className="container">
				<div className="col col-12"><h2>Follow</h2></div>
				<div className="social-links">
					{menuItems.map(item => <a key={`social-${item.id}`} target="_blank" rel="noopener noreferrer" title={`Next - ${item.label}`} href={item.url}>{item.label}</a>)}
				</div>
			</div>
		</div>
	);
};

export default SocialFooter;
