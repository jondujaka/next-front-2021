import React, { useState } from "react";
import { Link, navigate } from "gatsby";
import Dropdown from "react-dropdown";
import Style from "style-it";
import "react-dropdown/style.css";

const EditionMenu = ({
	items,
	bg,
	isSk = false,
	translationSlug,
	colors,
	skMenu,
	pageName,
	sticky
}) => {
	const navItems = items.nodes;
	const skNavItems = skMenu?.nodes;
	const menuItems = navItems
		.map((item, i) => {
			if (i === 0 || item.menuItems.hide) {
				return null;
			}

			if(isSk && (skNavItems || skNavItems[i])){
				return null;
			}


			let newUrl = parseUrl(isSk, item.url);
			let newLabel =
				isSk && skNavItems ? skNavItems[i].label : item.label;
			return {
				value: newUrl,
				label: newLabel
			};
		})
		.filter(item => item && item.label !== pageName);

	const internalHandleClick = item => {
		navigate(item.value);
	};

	const styles = colors
		? `
		.lang-switcher:hover {
			color: ${colors.backgroundColor};
			background: ${colors.borderColor};
			border-color: ${colors.borderColor};
		}

		.Dropdown-menu {
			background: ${colors.backgroundColor};
		}
		.Dropdown-option:hover,
		.Dropdown-option.is-selected {
			color: ${colors.backgroundColor};
			background: ${colors.textColor};
		}
	`
		: ``;

	const getHomeText = () => (isSk ? `Domov` : `Home`);

	const isDev =
			process.env.GATSBY_IS_PREVIEW ||
			process.env.CONTEXT !== `production`;

	return Style.it(
		styles,
		<div
			className={`edition-menu-wrapper ${
				sticky ? `position-sticky` : `position-fixed`
			}`}
			style={{ background: bg }}
		>
			<nav className="edition-nav">
				<ul className="desktop-edition-menu">
					<li>
						{navItems?.length &&
							navItems.map((item, i) => {
								if (item.menuItems.hide && !isDev) {
									return "";
								}

								if(isSk && (skNavItems || skNavItems[i])){
									return "";
								}
								return (
									<Link
										key={`item-${item.url}`}
										to={parseUrl(isSk, item.url)}
										getProps={isActive(item.url)}
										partiallyActive
									>
										{isSk
											? skNavItems[i].label
											: item.label}
									</Link>
								);
							})}
					</li>
				</ul>

				<div className="mobile-edition-menu">
					<ul>
						<li>
							<Link
								to={parseUrl(isSk, navItems[0].url)}
								partiallyActive
							>
								{isSk
									? skNavItems && skNavItems[0]?.label ? skNavItems[0]?.label : ""
									: navItems[0].label}
							</Link>
						</li>
					</ul>
					{menuItems && <Dropdown
						options={menuItems}
						onChange={internalHandleClick}
						placeholder={
							pageName === `index` ? getHomeText() : pageName
						}
					/>}
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

const isActive =
	url =>
	({ isCurrent, isPartiallyCurrent, location }) => {
		const activeClassName = { className: `active` };

		if (isCurrent) {
			return activeClassName;
		}

		if (isPartiallyCurrent && url.length < 6) {
			if (location.pathname.length <= 6) {
				return activeClassName;
			}
			return null;
		}

		if (
			(url.endsWith("/programme") || url.endsWith("/programme/")) &&
			location.pathname.includes("/events/")
		) {
			return activeClassName;
		}

		if (
			(url.endsWith("/artists") || url.endsWith("/artists/")) &&
			location.pathname.includes("/artist/")
		) {
			return activeClassName;
		}

		if (isCurrent || isPartiallyCurrent) {
			return activeClassName;
		}
	};

const parseUrl = (isSk, url) => {
	console.log(url)
	let parsedUrl = url;
	if (url.endsWith(`/`)) {
		parsedUrl = url.substring(0, url.length - 1);
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
