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

	return (
		<div className="social-footer py-4 py-lg-6">
			<div className="row">
				<div className="col col-12"><h1>Follow</h1></div>
				<div className="social-links social-one mt-2 mt-lg-4">
					{menuItems.map((item, i) => i<2 && <a key={`social-${item.id}`} target="_blank" rel="noopener noreferrer" title={`Next - ${item.label}`} href={item.url}>{item.label}</a>)}
				</div>
				<div className="social-links social-two mt-2 mt-lg-4">
					{menuItems.map((item, i) => i>2 && i < 5 && <a key={`social-${item.id}`} target="_blank" rel="noopener noreferrer" title={`Next - ${item.label}`} href={item.url}>{item.label}</a>)}
				</div>
				<div className="social-links social-three mt-2 mt-lg-4">
					{menuItems.map((item, i) => i>4 && <a key={`social-${item.id}`} target="_blank" rel="noopener noreferrer" title={`Next - ${item.label}`} href={item.url}>{item.label}</a>)}
				</div>
			</div>
		</div>
	);
};

export default SocialFooter;
