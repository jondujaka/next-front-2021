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
		<div className="social-footer">
			<div className="row">
				<div className="col col-12"><h1>Follow</h1></div>
				<div className="social-links social-one">
					{menuItems.map((item, i) => i<2 && <a key={`social-${item.id}`} target="_blank" rel="noopener noreferrer" title={`Next - ${item.label}`} href={item.url}>{item.label}</a>)}
				</div>
				<div className="social-links social-two">
					{menuItems.map((item, i) => i>2 && i < 5 && <a key={`social-${item.id}`} target="_blank" rel="noopener noreferrer" title={`Next - ${item.label}`} href={item.url}>{item.label}</a>)}
				</div>
				<div className="social-links social-three">
					{menuItems.map((item, i) => i>4 && <a key={`social-${item.id}`} target="_blank" rel="noopener noreferrer" title={`Next - ${item.label}`} href={item.url}>{item.label}</a>)}
				</div>
			</div>
		</div>
	);
};

export default SocialFooter;
