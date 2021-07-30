import React from "react";
import ProductBlock from "../productBlock";

const ProductsGrid = ({ items }) => {

	return (
		<>
			{items.map((item, i) => {
				return (
					<ProductBlock key={`product-${item.node.id}`} item={item} />
				);
			})}
		</>
	);
};

export default ProductsGrid;
