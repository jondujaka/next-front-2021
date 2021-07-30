import React, { useState } from "react";
import { Link, navigate } from "gatsby";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const EditionMenu = ({ items, bg, isSk = false, translationSlug, skMenu, pageName, sticky }) => {
	const navItems = items.nodes;
	const skNavItems = skMenu.nodes;
	const menuItems = navItems
		.map((item, i) => {
			if (i === 0) {
				return null;
			} else {
				let newUrl = parseUrl(isSk, item.url);
				let newLabel =
					isSk && skNavItems ? skNavItems[i].label : item.label;
				return {
					value: newUrl,
					label: newLabel
				};
			}
		})
		.filter(item => item && item.label !== pageName);

	const internalHandleClick = item => {
		navigate(item.value);
	};

	return (
		<div className={`edition-menu-wrapper ${sticky ? `position-sticky` : `position-fixed`}`} style={{ background: bg }}>
			<nav className="edition-nav">
				<ul className="desktop-edition-menu">
					<li>
						{navItems.length &&
							navItems.map((item, i) => (
								<Link
									key={`item-${item.url}`}
									to={parseUrl(isSk, item.url)}
									getProps={isActive(item.url)}
								>
									{isSk && skNavItems
										? skNavItems[i].label
										: item.label}
								</Link>
							))}
					</li>
				</ul>

				<div className="mobile-edition-menu">
					<ul>
						<li>
							<Link
								to={parseUrl(isSk, navItems[0].url)}
								getProps={isActive(navItems[0].url)}
							>
								{isSk && skNavItems
									? skNavItems[0].label
									: navItems[0].label}
							</Link>
						</li>
					</ul>
					<Dropdown
						options={menuItems}
						onChange={internalHandleClick}
						placeholder={pageName === `index` ? `Navigation` : pageName}
					/>
				</div>

				{translationSlug && !sticky && (
					<Link className="lang-switcher" to={translationSlug}>
						{isSk ? `EN` : `SK`}
					</Link>
				)}
			</nav>
		</div>
	);
};

const isActive = url => ({ isCurrent, isPartiallyCurrent, location }) => {

	const activeClassName = { className: `active` };

	if (isCurrent) {
		return activeClassName;
	}

	if (
		isPartiallyCurrent &&
		(url.endsWith("/index/") || url.endsWith("/index"))
	) {
		if (location.pathname.length === 6) {
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
	let parsedUrl = url;
	if(url.endsWith(`/`)){
		parsedUrl = url.substring(0, url.length-1);
	}
	if (parsedUrl.endsWith(`/index`)) {
		parsedUrl = url.substring(0, url.indexOf(`/index`));
	}
	
	if (isSk) {
		parsedUrl = `/sk${parsedUrl}`;
	}
	return parsedUrl;
};

export default EditionMenu;
