import React, { useRef, useState, useEffect } from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import Row from "../components/row";
import ArtistsGrid from "../components/blockGrids/artistsGrid";
import Filter from "../components/filter";
import { format, localeFormat } from "light-date";
import { node } from "prop-types";

const ArtistsTemplate = ({ data, pageContext }) => {
	const { settings, edition, menu, lang, skMenu } = pageContext;
	const isSk = lang !== `en`;
	const langSlug = lang === `en` ? `sk/` : ``;
	const translationSlug = `/${langSlug}${edition}/artists`;

	let artistsList = data.artists.edges;

	const eventsList = data.events.edges;

	const venueFilter = useRef("all");
	const formatFilter = useRef("all");
	const dayFilter = useRef("all");

	const allDays = [
		{
			label: isSk ? "Všetky dni" : "All Days",
			value: "all"
		}
	];

	let completeArtists = [];

	const getEventInfoByArtistId = artistId => {
		let infoArray = [];
		eventsList.forEach(({ node }) => {
			// console.log(node);

			const match =
				node.eventInfo?.artists &&
				node.eventInfo.artists.some(
					eventArtist => eventArtist.id === artistId
				);

			if (match) {
				infoArray.push({
					dates: node.eventInfo.dates,
					format:
						node.eventInfo.format.slug &&
						node.eventInfo.format.slug,
					venue: node.eventInfo.venue && node.eventInfo.venue.slug
				});
			}
		});
		return infoArray;
	};

	let newArtists = artistsList.map(artist => {
		return {
			...artist.node,
			info: [...getEventInfoByArtistId(artist.node.id)]
		};
	});

	const [allArtists, setAllArtists] = useState(newArtists);

	eventsList.forEach(({ node }) => {
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

	const getFilteredArtists = () => {
		return newArtists.filter(artist => {
			let dayMatch = false;
			let venueMatch = false;
			let formatMatch = false;

			console.log(artist);

			if (!artist.info.length) return false;
			artist.info &&
				artist.info.forEach(infoItem => {
					if (dayFilter.current === "all") {
						dayMatch = true;
					} else {
						infoItem.dates &&
							infoItem.dates.forEach(date => {
								if (date.date === dayFilter.current) {
									dayMatch = true;
								}
							});
					}

					if (
						venueFilter.current === "all" ||
						!infoItem.venue ||
						infoItem.venue === venueFilter.current
					) {
						venueMatch = true;
					}

					if (
						formatFilter.current === "all" ||
						!infoItem.format ||
						infoItem.format === formatFilter.current
					) {
						formatMatch = true;
					}
				});

			return dayMatch && venueMatch && formatMatch;
		});
	};

	const filterArtists = (slug, type) => {
		if (type === `day`) {
			dayFilter.current = slug;
		}
		if (type === `venue`) {
			venueFilter.current = slug;
		}
		if (type === `format`) {
			formatFilter.current = slug;
		}

		let filteredArtists = getFilteredArtists();

		setAllArtists(filteredArtists);
	};

	return (
		<Layout
			style={{
				color: settings.textColor,
				textColor: settings.textColor,
				backgroundColor: settings.backgroundColor
			}}
			editionHeader={menu}
			skMenu={skMenu}
			isSk={isSk}
			translationSlug={translationSlug}
			year={edition}
			pageName={isSk ? `Umelci` : `Artists`}
		>
			<Row fullWidth classes="border-bottom-thick">
				<div className="col col-12 px-0">
					<h1 className="normal-line-height fw-title">
						{isSk ? `Umelci` : `Artists`}
					</h1>
				</div>
				<div className="col col-12">
					<Filter
						colors={{
							textColor: settings.textColor,
							backgroundColor: settings.backgroundColor
						}}
						isSk={isSk}
						dayItems={allDays}
						handleClick={filterArtists}
					/>
				</div>
			</Row>
			<Row classes="mt-6 justify-content-start">
				{allArtists?.length ? (
					<ArtistsGrid colors={settings} items={allArtists} />
				) : (
					<h4>There are no Artists matching the selected filters.</h4>
				)}
			</Row>
		</Layout>
	);
};

export default ArtistsTemplate;

export const artistsQuery = graphql`
	query artistsPage($edition: String!, $lang: String!) {
		artists: allWpArtist(
			sort: { order: ASC, fields: slug }
			filter: {
				editions: { nodes: { elemMatch: { slug: { eq: $edition } } } }
				language: { slug: { eq: $lang } }
			}
		) {
			edges {
				node {
					id
					slug
					uri
					title
					language {
						slug
					}

					artistEventContent {
						images {
							srcSet
						}
					}
				}
			}
		}
		events: allWpEvent(
			filter: {
				editions: { nodes: { elemMatch: { slug: { eq: $edition } } } }
				language: { slug: { eq: $lang } }
			}
		) {
			edges {
				node {
					eventInfo {
						artists {
							... on WpArtist {
								id
							}
						}
						dates {
							date
						}
						format {
							slug
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
