import React from "react";
import ArtistBlock from "../ArtistBlock";

const ArtistsGrid = ({ items, style }) => {
	return (
		<>
			{items.map((artist, i) => {
				console.log(artist);
				return (
					<ArtistBlock
						key={`artist-${artist.id}-${i}`}
						item={artist.node}
					/>
				);
			})}
		</>
	);
};

export default ArtistsGrid;
