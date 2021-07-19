import React from "react";
import ArtistBlock from "../artistBlock";

const ArtistsGrid = ({ items,colors }) => {

	return (
		<>
			{items.map((artist, i) => {
				return (
					<ArtistBlock colors={colors} key={`artist-${artist.id}`} item={artist} />
				);
			})}
		</>
	);
};

export default ArtistsGrid;
