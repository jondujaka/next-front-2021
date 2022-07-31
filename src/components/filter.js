import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Style from "style-it";

const Filter = ({
	data,
	handleClick,
	dayItems,
	noFormats,
	colors,
	isSk = false
}) => {
	const internalHandleClick = (slug, type) => {
		handleClick(slug, type);
	};

	const { venues, formats } = useStaticQuery(
		graphql`
			query {
				venues: allWpVenue(sort: { fields: title }) {
					edges {
						node {
							slug
							title
							language {
								slug
							}
						}
					}
				}
				formats: allWpFormat(sort: { fields: name }) {
					edges {
						node {
							slug
							name
						}
					}
				}
			}
		`
	);

	const venueByLanguage = venues.edges.filter(edge => {
		if (isSk) {
			return edge.node.language.slug === "sk";
		}
		return edge.node.language.slug === "en";
	});
	const venueItems = [
		{ value: `all`, label: isSk ? `Všetky miesta` : `All Venues` },
		...venueByLanguage.map(edge => ({
			value: edge.node.slug,
			label: edge.node.title
		}))
	];
	const formatItems = [
		{ value: `all`, label: isSk ? `Všetky formáty` : `All Formats` },
		...formats.edges.map(edge => ({
			value: edge.node.slug,
			label: edge.node.name
		}))
	];

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
			{venueItems && (
				<Dropdown
					options={venueItems}
					onChange={e => internalHandleClick(e.value, `venue`)}
					placeholder={venueItems[0].label}
				/>
			)}
			{formatItems && !noFormats && (
				<Dropdown
					options={formatItems}
					onChange={e => internalHandleClick(e.value, `format`)}
					placeholder={formatItems[0].label}
				/>
			)}
		</div>
	);
};

export default Filter;
