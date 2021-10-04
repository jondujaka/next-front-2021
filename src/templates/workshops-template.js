import React, { useState, useRef } from "react";
import { graphql, Link } from "gatsby";
import { format, localeFormat } from "light-date";
import Layout from "../components/layout";
import Row from "../components/row";
import Filter from "../components/filter";
import ArtistsGrid from "../components/blockGrids/artistsGrid";

const WorkshopsTemplate = ({ data, pageContext }) => {
	// if (!data.workshops) {
	// 	return <h1>No workshops yet</h1>;
	// }
	const workshopsList = data.workshops.edges;
	const { settings, edition, menu, lang, skMenu } = pageContext;

	const [allWorkshops, setAllWorkshops] = useState(workshopsList);

	const dayFilter = useRef("all");
	const venueFilter = useRef("all");

	const isSk = lang !== `en`;
	const langSlug = lang === `en` ? `sk/` : ``;
	const translationSlug = `/${langSlug}${edition}/workshops`;

	const allDays = [
		{
			label: "All Days",
			value: "all"
		}
	];
	workshopsList.forEach(({ node }) => {
		node.eventInfo &&
			node.eventInfo.dates &&
			node.eventInfo.dates.forEach(date => {
				if (!allDays.find(day => day.value === date.date)) {
					const dateobj = new Date(date.date);
					const dayName = localeFormat(dateobj, "{EEE}");
					const monthName = localeFormat(dateobj, "{MMM}");
					const dayNr = format(dateobj, `{dd}`);
					allDays.push({
						label: `${dayName} ${dayNr} ${monthName}`,
						value: date.date
					});
				}
			});
	});

	const getFilteredWorkshops = () => {
		return workshopsList.filter(workshop => {
			const workShopinfo = workshop.node.eventInfo;

			let venueMatch = false;
			let dayMatch = false;

			if (dayFilter.current === "all") {
				dayMatch = true;
			} else {
				workShopinfo.dates.forEach(date => {
					if (date.date === dayFilter.current) {
						dayMatch = true;
					}
				});
			}

			venueMatch =
				venueFilter.current === "all" ||
				!workShopinfo.venue ||
				workShopinfo.venue.slug === venueFilter.current;

			return venueMatch && dayMatch;
		});
	};

	const filterWorkshops = (slug, type) => {
		if (type === `day`) {
			dayFilter.current = slug;
		}
		if (type === `venue`) {
			venueFilter.current = slug;
		}

		let filteredWorkshops = getFilteredWorkshops();

		setAllWorkshops(filteredWorkshops);
	};

	return (
		<Layout
			style={{
				color: settings.textColor,
				textColor: settings.textColor,
				backgroundColor: settings.backgroundColor
			}}
			isSk={isSk}
			translationSlug={translationSlug}
			editionHeader={menu}
			skMenu={skMenu}
			year={edition}
			pageName={isSk ? `Workshopy` : `Workshops`}
		>
			<Row fullWidth classes="border-bottom-thick">
				<div className="col col-12 px-0">
					<h1 className="normal-line-height fw-title">
						{isSk ? `Workshopy` : `Workshops`}
					</h1>
				</div>
				<div className="col col-12">
					<Filter
						colors={{
							textColor: settings.textColor,
							backgroundColor: settings.backgroundColor
						}}
						dayItems={allDays}
						handleClick={filterWorkshops}
						noFormats
					/>
				</div>
			</Row>
			<Row classes="mt-6 justify-content-start">
				{allWorkshops && allWorkshops.length ? (
					<ArtistsGrid colors={settings} items={allWorkshops} />
				) : (
					<h3>No workshops for the selected filters.</h3>
				)}
			</Row>
		</Layout>
	);
};

export default WorkshopsTemplate;

export const workshopsQuery = graphql`
	query workshopsPage($lang: String!) {
		workshops: allWpEvent(
			filter: {
				formats: { nodes: { elemMatch: { slug: { eq: "workshop" } } } }
				language: { slug: { eq: $lang } }
			}
			sort: { order: DESC, fields: date }
		) {
			edges {
				node {
					id
					slug
					uri
					title
					formats {
						nodes {
							slug
						}
					}
					artistEventContent {
						images {
							srcSet
						}
					  }
					eventInfo {
						dates {
							date
							starttime
							endtime
						}
						venue {
							... on WpVenue {
								id
								slug
								venueInfo {
									color
									mapsLink
								}
								title
							}
						}
					}
				}
			}
		}
	}
`;
