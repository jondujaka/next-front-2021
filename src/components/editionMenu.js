import React from "react";
import { Link } from "gatsby";

const EditionMenu = ({ items, bg, isSk = false, translationSlug, skMenu }) => {
	const navItems = items.nodes;
	const skNavItems = skMenu.nodes;
	return (
		<div className="edition-menu-wrapper" style={{ background: bg }}>
			<nav className="edition-nav">
				<ul>
					<li>
						{navItems.length &&
							navItems.map((item, i) => (
								<Link
									key={`item-${item.url}`}
									to={parseUrl(isSk, item.url)}
									getProps={isActive(item.url)}
								>
									{isSk && skNavItems ? skNavItems[i].label : item.label}
								</Link>
							))}
					</li>
				</ul>
				{translationSlug && <Link className="lang-switcher" to={translationSlug}>{isSk ? `EN` : `SK`}</Link>}
			</nav>
		</div>
	);
};

const isActive = url => ({ isCurrent, isPartiallyCurrent, location }) => {

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

const parseUrl = (isSk, url) => {
	let parsedUrl;
	if (url.endsWith(`/index/`)) {
		parsedUrl = url.substring(0, url.indexOf(`/index/`));
	} else {
		parsedUrl = url;
	}

	if(isSk){
		parsedUrl = `/sk${parsedUrl}`;
	}
	return parsedUrl;
};

export default EditionMenu;
