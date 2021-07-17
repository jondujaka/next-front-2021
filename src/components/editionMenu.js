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
									getProps={isActive(item.url)}
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

const isActive = url => ({ isCurrent, isPartiallyCurrent, location }) => {
	console.log(location.pathname);
	console.log(isCurrent);
	console.log(isPartiallyCurrent);

	const activeClassName = { className: `active` };

	if (isCurrent) {
		return activeClassName;
	}

	if (isPartiallyCurrent && (url.endsWith("/index/") || url.endsWith("/index"))) {
		if(location.pathname.length === 6){
			return activeClassName;
		}
		return null;
	}

	if (url.endsWith("/programme/") && location.pathname.includes("/events/")) {
		return activeClassName;
	}

	if (url.endsWith("/artists/") && location.pathname.includes("/artist/")) {
		return activeClassName;
	}

	if (isCurrent || isPartiallyCurrent) {
		return activeClassName;
	}
};

const parseUrl = url => {
	if (url.endsWith(`/index/`)) {
		return url.substring(0, url.indexOf(`/index/`));
	}
	return url;
};

export default EditionMenu;
