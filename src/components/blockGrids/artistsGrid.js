import React from "react";
import ArtistBlock from "../artistBlock";

const ArtistsGrid = ({ items, style }) => {
	return (
		<>
			{items.map((artist, i) => {
				return (
					<ArtistBlock key={`artist-${artist.id}`} item={artist} />
				);
			})}
		</>
	);
};

export default ArtistsGrid;
