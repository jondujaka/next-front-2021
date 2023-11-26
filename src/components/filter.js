import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Style from "style-it";

const Filter = ({
	data,
	handleClick,
	dayItems,
	formatItems,
	colors,
	isSk = false,
	venueItems
}) => {
	const internalHandleClick = (slug, type) => {
		handleClick(slug, type);
	};


	const styles = colors
		? `
			.Dropdown-option:hover,
			.Dropdown-option.is-selected {
				color: ${colors.backgroundColor};
				background: ${colors.textColor};
			}
			.Dropdown-menu {
				background: ${colors.backgroundColor};
			}
		`
		: ``;

	return Style.it(
		styles,
		<div className="filter-wrapper">
			{dayItems && (
				<Dropdown
					options={dayItems}
					onChange={e => internalHandleClick(e.value, `day`)}
					placeholder={isSk ? `Všetky dni` : `All Days`}
				/>
			)}
			{venueItems?.length && (
				<Dropdown
					options={venueItems}
					onChange={e => internalHandleClick(e.value, `venue`)}
					placeholder={isSk ? `Všetky miesta` : `All Venues`}
				/>
			)}
			{formatItems && (
				<Dropdown
					options={formatItems}
					onChange={e => internalHandleClick(e.value, `format`)}
					placeholder={isSk ? `Všetky formáty` : `All Formats`}
				/>
			)}
		</div>
	);
};

export default Filter;
