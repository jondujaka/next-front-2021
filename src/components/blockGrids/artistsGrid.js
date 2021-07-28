import React from "react";
import ArtistBlock from "../artistBlock";

const ArtistsGrid = ({ items,colors }) => {

	return (
		<>
			{items.map((item, i) => {
				return (
					<ArtistBlock colors={colors} key={`artist-${item.id}`} item={item} />
				);
			})}
		</>
	);
};

export default ArtistsGrid;
