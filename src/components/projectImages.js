import React, { useState } from "react";
import Separator from "./separator";
import Row from "./row";
import CloseButton from "../images/optimized/close-button.svg";
const ProjectImages = ({ images }) => {
	const [showMore, setShowMore] = useState(images.imageGroups.length <= 1);

	const handleClick = e => {
		e.preventDefault();
		setShowMore(true);
	};
	return (
		<>
			<Separator />
			<Row id="project-pictures">
				<div className="col col-12 mt-5 mb-6">
					<h1>{images.title}</h1>
				</div>
				{images.imageGroups.map((group, i) => {
					if (!showMore && i > 0) {
						return null;
					}
					return (
						<React.Fragment key={group.groupTitle}>
							<div className="col col-12 mt-4">
								<h3 className="mb-0">{group.groupTitle}</h3>
							</div>
							{group.images.map(
								(image, i) =>
									image &&
									image.srcSet &&
									(showMore || i < 6) && (
										<RenderImage
											key={image.sourceUrl}
											image={image}
										/>
									)
							)}
						</React.Fragment>
					);
				})}
				{!showMore && (
					<div className="col col-12 text-center mt-5">
						<a
							className="big-button"
							href="#"
							onClick={handleClick}
						>
							See more
						</a>
					</div>
				)}
			</Row>
		</>
	);
};

const RenderImage = ({ image }) => {
	const [openLightbox, setOpenLightbox] = useState(false);

	return (
		<div className="col col-12 col-md-6 col-lg-4 project-image">
			<div
				onClick={() => setOpenLightbox(true)}
				className="square image-wrapper"
			>
				<img className="img-fluid" srcSet={image.srcSet} />
			</div>
			{openLightbox ? (
				<LightBox
					key={`lightbox-${image.sourceUrl}`}
					image={image}
					close={()=>setOpenLightbox(false)}
				/>
			) : (
				``
			)}
		</div>
	);
};

const LightBox = ({ image, close }) => {
	const caption = image.caption || `<p>No caption</p>`;
	return (
		<div className="lightbox-wrapper">
			<button className="lightbox-close" onClick={close}>
				<img src={CloseButton} />
			</button>
			<div className="lightbox-bg">
				<div className="lightbox-image-wrapper">
					<figure>
						<img src={image.sourceUrl} className="lightbox-image" />
						{caption && (
							<figcaption
								dangerouslySetInnerHTML={{
									__html: caption
								}}
							/>
						)}
					</figure>
				</div>
			</div>
		</div>
	);
};

export default ProjectImages;
