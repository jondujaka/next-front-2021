import React from "react";
import { Link } from "gatsby";

const EditionMenu = ({ items, bg }) => {
	const navItems = items.nodes;
	return (
		<div className="edition-menu-wrapper" style={{ background: bg }}>
			<nav className="edition-nav">
				<ul>
					<li>
						{navItems.length &&
							navItems.map(item => (
								<Link
									key={`item-${item.url}`}
									to={parseUrl(item.url)}
									activeClassName="active"
								>
									{item.label}
								</Link>
							))}
					</li>
				</ul>
			</nav>
		</div>
	);
};

const parseUrl = url => {
	if (url.endsWith(`/index/`)) {
		return url.substring(0, url.indexOf(`/index/`));
	}
	return url;
};

export default EditionMenu;
