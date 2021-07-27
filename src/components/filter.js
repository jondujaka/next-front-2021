import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const Filter = ({ data, handleClick, dayItems }) => {
	const internalHandleClick = (slug, type) => {
		handleClick(slug, type);
	};

	const { venues, formats } = useStaticQuery(
		graphql`
			query {
				venues: allWpVenue {
					edges {
						node {
							slug
							title
						}
					}
				}
				formats: allWpFormat {
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

	const venueItems = [
		{ value: `all`, label: `All Venues` },
		...venues.edges.map(edge => ({
			value: edge.node.slug,
			label: edge.node.title
		}))
	];
	const formatItems = [
		{ value: `all`, label: `All Formats` },
		...formats.edges.map(edge => ({
			value: edge.node.slug,
			label: edge.node.name
		}))
	];

	return (
		<div className="filter-wrapper">
			{dayItems && (
				<Dropdown
					options={dayItems}
					onChange={e => internalHandleClick(e.value, `day`)}
					placeholder="All Days"
				/>
			)}
			{venueItems && (
				<Dropdown
					options={venueItems}
					onChange={e => internalHandleClick(e.value, `venue`)}
					placeholder="All Venues"
				/>
			)}
			{formatItems && (
				<Dropdown
					options={formatItems}
					onChange={e => internalHandleClick(e.value, `format`)}
					placeholder="All Formats"
				/>
			)}
		</div>
	);
};

export default Filter;
