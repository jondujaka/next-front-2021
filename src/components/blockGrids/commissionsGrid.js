import React from "react";
import Masonry from "react-masonry-css";
import CommissionBlock from "../commissionBlock";

const commissionsGrid = ({ items }) => {
	return (
		<>
			{items.map((comItem, i) =>
				comItem ? (
					<CommissionBlock
						key={`coms-${comItem.node.id}-${i}`}
						item={comItem.node}
					/>
				) : null
			)}
		</>
	);
};

export default commissionsGrid;
