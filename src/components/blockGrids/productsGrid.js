import React from "react";
import ProductBlock from "../productBlock";

const ProductsGrid = ({ items }) => {

	return (
		<>
			{items.length ? items.map((item, i) => {
				return (
					<ProductBlock key={`product-${item.node.slug}`} item={item} />
				);
			}): <h3>No items yet</h3>}
		</>
	);
};

export default ProductsGrid;
