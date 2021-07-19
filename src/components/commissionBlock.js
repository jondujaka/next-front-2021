import React from "react";
import { Link } from "gatsby";

const CommissionBlock = ({ item }) => {
	let image = item.featuredImage?.node.mediaDetails.sizes.find(size => size.name === `big-thumbnail`);
	if(!image){
		image = {
			sourceUrl: `https://nextfestival.sk/content/wp-content/uploads/2021/05/photo-1620503292890-c597f62cce8d.jpg`
		}
	};

	const bg = {
		backgroundImage: `url(${image.sourceUrl})`,
		backgroundSize: `cover`,
		backgroundPosition: `center`
	}
	return (
		<Link
			className="commission-item py-5 px-2 col-6 mb-6 col-lg-4"
			to={item.uri}
		>
			<div className="row">
				<div className="commission-info col col-12 text-center">
					<h3 className="text-body commission-title">{item.title}</h3>
				</div>
				<div className="commission-image-wrapper col col-12">
					<div className="commission-image" style={bg} >
					</div>
				</div>
				
			</div>
		</Link>
	);
};

export default CommissionBlock;
